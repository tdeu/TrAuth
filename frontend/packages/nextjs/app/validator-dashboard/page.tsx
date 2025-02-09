/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { Address } from "~~/components/scaffold-eth";

const contractAddress = '0xbcdd5cc1cd0fa804ae1ea14e05922a6222a5bc9f';

const AUTHENTIFICATION_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "submissionId", type: "uint256" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "validateMask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "submissionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "submissions",
    outputs: [
      { internalType: "address", name: "submitter", type: "address" },
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint8", name: "approvalCount", type: "uint8" },
      { internalType: "uint8", name: "rejectionCount", type: "uint8" },
      { internalType: "bool", name: "isAuthenticated", type: "bool" },
      { internalType: "bool", name: "isCompleted", type: "bool" }
    ],
    stateMutability: "view",
    type: "function",
  },
];

type SubmissionResult = [
  string,  // submitter
  string,  // ipfsHash
  bigint,  // approvalCount
  bigint,  // rejectionCount
  boolean, // isAuthenticated
  boolean  // isCompleted
];

type Submission = {
  id: number;
  submitter: string;
  maskName: string;
  approvalCount: number;
  rejectionCount: number;
  isAuthenticated: boolean;
  isCompleted: boolean;
  estimatedEthnicGroup: string;
  transactionHash: string;
  status: string;
};

type ValidationStatus = {
  status: 'justValidated' | 'error';
  hash?: string;
  message?: string;
};

export default function ValidatorDashboard() {
  const { address: connectedAddress } = useAccount();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [validationChoices, setValidationChoices] = useState<Record<number, { authenticity?: string; ethnicGroup?: string }>>({});
  const [validationStatuses, setValidationStatuses] = useState<Record<number, ValidationStatus>>({});

  useEffect(() => {
    if (connectedAddress) {
      fetchSubmissions();
    }
  }, [connectedAddress]);

  const fetchTransactionHash = async (submissionId: number): Promise<string> => {
    // This function should fetch the transaction hash for the given submissionId
    // For now, we'll return a placeholder. Replace this with actual logic to fetch the hash.
    return `0x${submissionId.toString(16).padStart(64, '0')}`;
  };

  const fetchSubmissions = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http()
        });
  
        const submissionCount = await publicClient.readContract({
          address: contractAddress,
          abi: AUTHENTIFICATION_ABI,
          functionName: 'submissionCount',
        });
  
        const fetchedSubmissions: Submission[] = [];
        for (let i = Number(submissionCount) - 1; i >= 0; i--) {
          const submission = (await publicClient.readContract({
            address: contractAddress,
            abi: AUTHENTIFICATION_ABI,
            functionName: 'submissions',
            args: [BigInt(i)],
          })) as SubmissionResult;
  
          // Retrieve the transaction hash from localStorage
          const transactionHash = localStorage.getItem(`maskSubmission_${submission[1]}`) || 'Hash not found';
  
          let status = 'Pending';
          if (submission[5]) {  // isCompleted
            status = 'Completed';
          } else if (submission[4]) {  // isAuthenticated
            status = 'Authenticated';
          } else if (Number(submission[2]) > 0 || Number(submission[3]) > 0) {  // approvalCount or rejectionCount
            status = 'Validated';
          }
  
          fetchedSubmissions.push({
            id: i,
            submitter: submission[0],
            maskName: submission[1],
            approvalCount: Number(submission[2]),
            rejectionCount: Number(submission[3]),
            isAuthenticated: submission[4],
            isCompleted: submission[5],
            estimatedEthnicGroup: "Yoruba", // This should be fetched from your FC results
            transactionHash: transactionHash,
            status: status
          });
        }
  
        setSubmissions(fetchedSubmissions.filter(s => !s.isCompleted));
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

  const handleExpandRow = (submissionId: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }));
  };

  const handleValidationChoice = (submissionId: number, type: 'authenticity' | 'ethnicGroup', choice: string) => {
    setValidationChoices(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [type]: choice
      }
    }));
  };

  const handleValidate = async (submissionId: number) => {
    const choices = validationChoices[submissionId];
    if (!choices || !choices.authenticity || !choices.ethnicGroup) {
      alert("Please make a choice for both authenticity and ethnic group.");
      return;
    }

    const approved = choices.authenticity === 'yes' && choices.ethnicGroup === 'yes';

    if (typeof window.ethereum !== 'undefined') {
      try {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http()
        });

        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom(window.ethereum)
        });

        const [address] = await walletClient.requestAddresses();

        const { request } = await publicClient.simulateContract({
          account: address,
          address: contractAddress,
          abi: AUTHENTIFICATION_ABI,
          functionName: 'validateMask',
          args: [BigInt(submissionId), approved],
        });

        const hash = await walletClient.writeContract(request);

        setValidationStatuses(prev => ({
          ...prev,
          [submissionId]: { status: 'justValidated', hash }
        }));

        await publicClient.waitForTransactionReceipt({ hash });
        fetchSubmissions();
      } catch (error) {
        console.error(error);
        setValidationStatuses(prev => ({
          ...prev,
          [submissionId]: { status: 'error', message: 'Mask already validated.' }
        }));
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Validator Dashboard</h1>
        <div className="flex items-center space-x-2">
          Connected: <Address address={connectedAddress || ''} />
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Mask ID</th>
              <th>Submitter</th>
              <th>Transaction Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <React.Fragment key={submission.id}>
                <tr className="hover">
                  <td>
                    <button onClick={() => handleExpandRow(submission.id)} className="btn btn-ghost btn-xs">
                      {expandedRows[submission.id] ? '▲' : '▼'}
                    </button>
                  </td>
                  <td>Mask #{submission.id}</td>
                  <td><Address address={submission.submitter} /></td>
                  <td>{submission.transactionHash.slice(0, 10)}...</td>
                  <td style={{
    fontWeight: 'bold',
    color: submission.status === 'Pending' ? '#FF4136' :
           submission.status === 'Validated' ? '#2ECC40' : 'inherit'
  }}>
    {submission.status}
  </td>
                </tr>
                {expandedRows[submission.id] && (
                  <tr>
                    <td colSpan={5}>
                      <div className="p-4 bg-base-200">
                        <div className="mb-4">
                          <p className="font-semibold mb-2">Authentic?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleValidationChoice(submission.id, 'authenticity', 'yes')}
                              className={`btn btn-sm ${validationChoices[submission.id]?.authenticity === 'yes' ? 'btn-primary' : 'btn-outline'}`}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => handleValidationChoice(submission.id, 'authenticity', 'no')}
                              className={`btn btn-sm ${validationChoices[submission.id]?.authenticity === 'no' ? 'btn-primary' : 'btn-outline'}`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="font-semibold mb-2">Belongs to {submission.estimatedEthnicGroup}?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleValidationChoice(submission.id, 'ethnicGroup', 'yes')}
                              className={`btn btn-sm ${validationChoices[submission.id]?.ethnicGroup === 'yes' ? 'btn-primary' : 'btn-outline'}`}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => handleValidationChoice(submission.id, 'ethnicGroup', 'no')}
                              className={`btn btn-sm ${validationChoices[submission.id]?.ethnicGroup === 'no' ? 'btn-primary' : 'btn-outline'}`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleValidate(submission.id)}
                          className="btn btn-primary btn-sm w-full mt-2"
                        >
                          Submit Validation
                        </button>
                        {validationStatuses[submission.id]?.status === 'justValidated' && (
                          <p className="text-green-500 mt-2">Validation submitted successfully!</p>
                        )}
                        {validationStatuses[submission.id]?.status === 'error' && (
                          <p className="text-red-500 mt-2">{validationStatuses[submission.id]?.message}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {submissions.length === 0 && (
        <p className="text-center mt-8">No masks currently awaiting validation.</p>
      )}
    </div>
  );
}