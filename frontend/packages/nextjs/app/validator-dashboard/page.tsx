/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
<<<<<<< HEAD
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
=======
import { useAccount, usePublicClient } from 'wagmi';
import { Address } from "~~/components/scaffold-eth";
import Image from "next/image";

// Use Alchemy or Infura URL instead of direct Sepolia RPC
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"; // Replace with your Alchemy API key
// Or for Infura: "https://sepolia.infura.io/v3/YOUR-PROJECT-ID"

const contractAddress = '0xbcdd5cc1cd0fa804ae1ea14e05922a6222a5bc9f';

interface MaskSubmission {
  submissionId: number;
  submitter: string;
  ipfsHash: string;
  txHash: string;
  approvalCount: number;
  rejectionCount: number;
  isAuthenticated: boolean;
  isCompleted: boolean;
}

interface MaskDetails {
  images: string[];
  validations: {
    validator: string;
    approved: boolean;
    timestamp: number;
  }[];
}

const AUTHENTIFICATION_ABI = [
  {
>>>>>>> 629a0c6 (Initial commit)
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
<<<<<<< HEAD
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
=======
  {
    inputs: [],
    name: "submissionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "ipfsHash", type: "string" }],
    name: "submitMask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "submissionId", type: "uint256" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "validateMask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

export default function ValidatorDashboard() {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient();
  const [submissions, setSubmissions] = useState<MaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedMask, setSelectedMask] = useState<MaskSubmission | null>(null);
  const [maskDetails, setMaskDetails] = useState<MaskDetails | null>(null);
>>>>>>> 629a0c6 (Initial commit)

  useEffect(() => {
    if (connectedAddress) {
      fetchSubmissions();
    }
  }, [connectedAddress]);

<<<<<<< HEAD
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
=======
  const fetchSubmissions = async () => {
    try {
      const count = await publicClient.readContract({
        address: contractAddress,
        abi: AUTHENTIFICATION_ABI,
        functionName: 'submissionCount',
      }) as bigint;

      // Fetch submission events directly
      const events = await publicClient.getLogs({
        address: contractAddress,
        event: {
          type: 'event',
          name: 'MaskSubmitted',
          inputs: [
            { type: 'uint256', name: 'submissionId', indexed: true },
            { type: 'address', name: 'submitter', indexed: true },
            { type: 'string', name: 'ipfsHash' }
          ],
        },
        fromBlock: BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK || '0'),
        toBlock: 'latest'
      });

      console.log("Events:", events);

      // Create a map of ipfsHash to transaction hash
      const txHashMap = new Map(
        events.map(event => [event.args.ipfsHash, event.transactionHash])
      );

      console.log("Transaction hash map:", txHashMap);

      // Fetch all submissions
      const submissionPromises = [];
      for (let i = 0; i < Number(count); i++) {
        submissionPromises.push(
          publicClient.readContract({
>>>>>>> 629a0c6 (Initial commit)
            address: contractAddress,
            abi: AUTHENTIFICATION_ABI,
            functionName: 'submissions',
            args: [BigInt(i)],
<<<<<<< HEAD
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

=======
          })
        );
      }

      const submissionResults = await Promise.all(submissionPromises);
      const formattedSubmissions = submissionResults.map((result: any, index) => ({
        submissionId: index,
        submitter: result[0],
        ipfsHash: result[1],
        approvalCount: result[2],
        rejectionCount: result[3],
        isAuthenticated: result[4],
        isCompleted: result[5],
        txHash: txHashMap.get(result[1]) || '' // Use ipfsHash to get txHash
      }));

      setSubmissions(formattedSubmissions);
      setLoading(false);
    } catch (err: any) {
      console.error('Error details:', err);
      setError(`Failed to fetch submissions: ${err.message}`);
      setLoading(false);
    }
  };

  const handleValidation = async (submissionId: number, approved: boolean) => {
    if (!window.ethereum || !connectedAddress) {
      setError('Please connect your wallet!');
      return;
    }

    setValidating(true);
    try {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      });

      const hash = await walletClient.writeContract({
        account: connectedAddress,
        address: contractAddress,
        abi: AUTHENTIFICATION_ABI,
        functionName: 'validateMask',
        args: [BigInt(submissionId), approved],
      });

      setStatus(`Validation submitted! Transaction: ${hash}`);
      await fetchSubmissions(); // Refresh the list after validation
    } catch (err: any) {
      console.error('Error validating submission:', err);
      setError(err.message || 'Failed to validate submission');
    } finally {
      setValidating(false);
    }
  };

  const openMaskDetails = async (submission: MaskSubmission) => {
    setSelectedMask(submission);
    // In a real implementation, you would fetch these from IPFS using the ipfsHash
    // For now, we'll simulate the data
    const mockDetails: MaskDetails = {
      images: [
        submission.ipfsHash + "_front",
        submission.ipfsHash + "_back"
      ],
      validations: [
        {
          validator: "0x123...",
          approved: true,
          timestamp: Date.now() - 100000
        },
        // ... other validations
      ]
    };
    setMaskDetails(mockDetails);
  };

  const MaskDetailsModal = () => {
    if (!selectedMask || !maskDetails) return null;

    const totalVotes = selectedMask.approvalCount + selectedMask.rejectionCount;
    const votesNeeded = 10 - totalVotes;
    const approvalPercentage = totalVotes > 0 
      ? (selectedMask.approvalCount / totalVotes) * 100 
      : 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Mask #{selectedMask.submissionId}</h2>
            <button 
              onClick={() => setSelectedMask(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded p-2">
              <h3 className="font-semibold mb-2">Front View</h3>
              <div className="aspect-square relative bg-gray-100">
                {/* Replace with actual IPFS image */}
                <Image 
                  src="/placeholder-front.jpg" 
                  alt="Front view"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="border rounded p-2">
              <h3 className="font-semibold mb-2">Back View</h3>
              <div className="aspect-square relative bg-gray-100">
                {/* Replace with actual IPFS image */}
                <Image 
                  src="/placeholder-back.jpg" 
                  alt="Back view"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>

          {/* Validation Progress */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Validation Progress</h3>
            <div className="flex justify-between mb-1">
              <span>Progress: {totalVotes}/10 votes</span>
              <span>{Math.round(approvalPercentage)}% Approved</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="h-2.5 rounded-full bg-blue-600"
                style={{width: `${Math.min(totalVotes * 10, 100)}%`}}
              />
            </div>
            {votesNeeded > 0 && (
              <p className="text-gray-600">
                {votesNeeded} more {votesNeeded === 1 ? 'vote' : 'votes'} needed for final decision
              </p>
            )}
          </div>

          {/* Validation Actions */}
          {!selectedMask.isCompleted && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleValidation(selectedMask.submissionId, true)}
                disabled={validating}
                className="flex-1 btn btn-success"
              >
                Validate as Authentic
              </button>
              <button
                onClick={() => handleValidation(selectedMask.submissionId, false)}
                disabled={validating}
                className="flex-1 btn btn-error"
              >
                Mark as Inauthentic
              </button>
            </div>
          )}

          {/* Previous Validations */}
          <div>
            <h3 className="font-semibold mb-2">Validation History</h3>
            <div className="space-y-2">
              {maskDetails.validations.map((validation, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Address address={validation.validator} />
                    <span className={validation.approved ? 'text-green-600' : 'text-red-600'}>
                      {validation.approved ? '✓ Validated' : '✗ Rejected'}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(validation.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center p-8">Loading submissions...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

>>>>>>> 629a0c6 (Initial commit)
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
<<<<<<< HEAD
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
=======
              <th>Mask ID</th>
              <th>Submitter</th>
              <th>Transaction</th>
              <th>Validation Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const totalVotes = submission.approvalCount + submission.rejectionCount;
              const approvalPercentage = totalVotes > 0 
                ? (submission.approvalCount / totalVotes) * 100 
                : 0;
              const isValidated = totalVotes >= 10;
              const isAuthenticated = isValidated && approvalPercentage >= 80;

              return (
                <tr key={submission.submissionId} className="hover">
                  <td>
                    <button 
                      onClick={() => openMaskDetails(submission)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Mask #{submission.submissionId}
                    </button>
                  </td>
                  <td>
                    <Address address={submission.submitter} />
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm">Ref: {submission.ipfsHash}</span>
                      {submission.txHash ? (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${submission.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Transaction
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">Transaction not found</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span>Progress: {totalVotes}/10 votes</span>
                        <span>{Math.round(approvalPercentage)}% Approved</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            isValidated 
                              ? approvalPercentage >= 80 
                                ? 'bg-green-600' 
                                : 'bg-red-600'
                              : 'bg-blue-600'
                          }`}
                          style={{width: `${Math.min(totalVotes * 10, 100)}%`}}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    {isValidated 
                      ? (isAuthenticated ? 'Authenticated' : 'Rejected')
                      : `${10 - totalVotes} more votes needed`
                    }
                  </td>
                  <td>
                    {!submission.isCompleted && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleValidation(submission.submissionId, true)}
                          disabled={validating}
                          className="btn btn-sm btn-success"
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => handleValidation(submission.submissionId, false)}
                          disabled={validating}
                          className="btn btn-sm btn-error"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
>>>>>>> 629a0c6 (Initial commit)
          </tbody>
        </table>
      </div>
      {submissions.length === 0 && (
        <p className="text-center mt-8">No masks currently awaiting validation.</p>
      )}
<<<<<<< HEAD
=======
      {error && (
        <div className="alert alert-error mt-4">
          <p>{error}</p>
        </div>
      )}
      {selectedMask && <MaskDetailsModal />}
>>>>>>> 629a0c6 (Initial commit)
    </div>
  );
}