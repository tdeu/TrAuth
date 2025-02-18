/* eslint-disable prettier/prettier */
'use client'
import React, { useState } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
<<<<<<< HEAD
=======
import axios from 'axios';
import { modelService, PredictionResult } from '../../services/modelService';
>>>>>>> 629a0c6 (Initial commit)

const contractAddress = '0xbcdd5cc1cd0fa804ae1ea14e05922a6222a5bc9f';

const AUTHENTIFICATION_ABI = [
  {
    inputs: [{ internalType: "string", name: "ipfsHash", type: "string" }],
    name: "submitMask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const generateRandomPercentage = () => Math.floor(Math.random() * 101);

const generateRandomOption = (options: string | any[]) => {
  return options[Math.floor(Math.random() * options.length)];
};

const generateRandomTribalGroup = () => {
  const groups = ['Yoruba', 'Dogon', 'Dan', 'Senufo', 'Bamana', 'Baule'];
  return groups[Math.floor(Math.random() * groups.length)];
};

<<<<<<< HEAD
export default function MaskSubmissionPage() {
  const [status, setStatus] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [authenticityResults, setAuthenticityResults] = useState<Record<string, number>>({});
  const [tribalGroupResults, setTribalGroupResults] = useState<Record<string, string>>({});
  const [overallAuthenticity, setOverallAuthenticity] = useState(0);
  const [predictedTribalGroup, setPredictedTribalGroup] = useState('');
  const [tribalGroupProbability, setTribalGroupProbability] = useState(0);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (value: string | null) => void
  ) => {
=======
interface AIPrediction {
  predictions: Array<{
    tribalGroup: string;
    region: string;
    probability: number;
  }>;
}

export default function MaskSubmissionPage() {
  const [status, setStatus] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
>>>>>>> 629a0c6 (Initial commit)
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
<<<<<<< HEAD
          setImage(result);
=======
          setMaskImage(result);
>>>>>>> 629a0c6 (Initial commit)
        }
      };
      reader.readAsDataURL(file);
    }
  };

<<<<<<< HEAD
  const simulateAnalysis = () => {
    setStatus('Machine is analyzing your mask, please hold on...');
    setTimeout(() => {
      const authFeatures = {
        'Wood grain and texture': generateRandomPercentage(),
        'Patina and signs of natural aging': generateRandomPercentage(),
        'Hand-carving marks and asymmetries': generateRandomPercentage(),
        'Quality and application of pigments': generateRandomPercentage(),
        'Wear patterns consistent with ritual use': generateRandomPercentage(),
        'Traditional hanging mechanism': generateRandomPercentage(),
        'Proper interior hollowing': generateRandomPercentage(),
        'Absence of modern materials or fasteners': generateRandomPercentage(),
        'Consistent proportions and style': generateRandomPercentage(),
        'Cultural-specific elements': generateRandomPercentage(),
      };

      const tribalFeatures = {
        'Overall face shape': generateRandomOption(['Oval', 'Heart-shaped', 'Elongated', 'Round', 'Rectangular', 'Triangular']),
        'Eye shape and size': generateRandomOption(['Almond-shaped', 'Round', 'Narrow slits', 'Protruding', 'Sunken', 'Asymmetrical']),
        'Nose shape and size': generateRandomOption(['Long and narrow', 'Short and broad', 'Hooked', 'Flattened', 'Exaggerated or stylized', 'Minimal or absent']),
        'Mouth shape and expression': generateRandomOption(['Pursed lips', 'Open mouth (showing teeth)', 'Downturned', 'Upturned (smiling)', 'Elongated', 'Minimally defined']),
        'Presence and style of scarification marks': generateRandomOption(['Linear patterns', 'Geometric shapes', 'Dotted patterns', 'Raised keloids', 'Absent', 'Painted representation']),
        'Forehead shape and size': generateRandomOption(['High and domed', 'Low and sloping', 'Wide', 'Narrow', 'With bulging brows', 'Decorated or patterned']),
        'Cheekbone prominence': generateRandomOption(['High and pronounced', 'Subtle or flat', 'Angular', 'Rounded', 'Exaggerated', 'Asymmetrical']),
        'Chin shape and prominence': generateRandomOption(['Pointed', 'Squared', 'Rounded', 'Jutting', 'Recessed', 'Decorated or bearded']),
        'Ear representation': generateRandomOption(['Large and prominent', 'Small or minimally defined', 'Stylized or geometric', 'Pierced or with ornaments', 'Absent', 'Exaggerated or elongated']),
        'Hairstyle or headdress design': generateRandomOption(['Elaborate coiffure', 'Simple cap or helmet', 'Animal-inspired (e.g., horns)', 'Geometric patterns', 'With attached materials (e.g., raffia, feathers)', 'Bald or smooth']),
        'Presence and style of facial hair': generateRandomOption(['Full beard', 'Mustache only', 'Goatee', 'Stylized or geometric beard', 'Absent', 'Painted or carved representation']),
        'Proportions between facial features': generateRandomOption(['Balanced and naturalistic', 'Exaggerated eyes', 'Dominant forehead', 'Elongated lower face', 'Minimized features', 'Highly stylized or abstract']),
        'Symbolic patterns or motifs': generateRandomOption(['Geometric designs', 'Animal motifs', 'Plant-inspired patterns', 'Cosmic symbols (e.g., sun, moon)', 'Abstract spiritual symbols', 'Absence of symbolic patterns']),
        'Color scheme and pigments used': generateRandomOption(['Monochromatic', 'Bichromatic (often black and white)', 'Earth tones (ochres, browns)', 'Vibrant colors (reds, blues)', 'Metallic pigments', 'Natural wood color with minimal pigment']),
        'Specific adornments': generateRandomOption(['Lip plates or plugs', 'Nose rings', 'Multiple piercings', 'Inlaid materials (shells, metal)', 'Attached organic materials (hair, fur)', 'Absence of adornments']),
      };

      setAuthenticityResults(authFeatures);
      setTribalGroupResults(tribalFeatures);
      setOverallAuthenticity(Math.floor(Object.values(authFeatures).reduce((a, b) => a + b, 0) / Object.keys(authFeatures).length));
      setPredictedTribalGroup(generateRandomTribalGroup());
      setTribalGroupProbability(generateRandomPercentage());
      setAnalysisComplete(true);
      setStatus('Machine check done, lets see what humans think of it now...');
    }, 3000);
=======
  const handleAnalysis = async () => {
    if (!maskImage) return;
    setStatus('AI is analyzing your mask...');
    
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const predictions = await modelService.predict();
      setAiPrediction({ predictions: predictions.map(pred => ({
        tribalGroup: pred.tribe,
        region: pred.region,
        probability: pred.probability
      }))});
      
      setStatus('AI analysis complete!');
    } catch (error) {
      console.error('AI analysis failed:', error);
      setStatus('Error during AI analysis. Please try again.');
    }
>>>>>>> 629a0c6 (Initial commit)
  };

  const handleSubmitMask = async () => {
    setStatus('Processing submission...');

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

        const hash = await walletClient.writeContract({
          account: address,
          address: contractAddress,
          abi: AUTHENTIFICATION_ABI,
          functionName: 'submitMask',
          args: [ipfsHash],
        });

        setStatus(`Mask submitted successfully! Transaction hash: ${hash}`);

        await publicClient.waitForTransactionReceipt({ hash });
      } catch (error) {
        console.error(error);
        setStatus('Error submitting mask. Check console for details.');
      }
    } else {
      setStatus('Please install MetaMask!');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm text-black">
        <h1 className="text-4xl font-bold mb-8">Mask Submission and Analysis</h1>
        
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
<<<<<<< HEAD
          <h2 className="text-2xl font-bold mb-4">Upload Mask Images</h2>
          <div className="flex justify-between mb-4">
            <div>
              <input type="file" onChange={(e) => handleImageUpload(e, setFrontImage)} className="mb-2" />
              {frontImage && <img src={frontImage} alt="Front of mask" className="w-40 h-40 object-cover" />}
            </div>
            <div>
              <input type="file" onChange={(e) => handleImageUpload(e, setBackImage)} className="mb-2" />
              {backImage && <img src={backImage} alt="Back of mask" className="w-40 h-40 object-cover" />}
            </div>
          </div>
          <button 
            onClick={simulateAnalysis} 
            disabled={!frontImage || !backImage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Analyze Mask
          </button>
        </div>

        {analysisComplete && (
          <>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4">Authenticity Analysis</h2>
              {Object.entries(authenticityResults).map(([feature, value]) => (
                <div key={feature} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{feature}:</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${value}%`}}></div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <strong>Probability of authenticity: {overallAuthenticity}%</strong>
              </div>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-4">Tribal Group Analysis</h2>
              {Object.entries(tribalGroupResults).map(([feature, value]) => (
                <div key={feature} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{feature}:</span>
                    <span>{value}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <strong>Probability of {tribalGroupProbability}% it belongs to ethnic group: {predictedTribalGroup}</strong>
              </div>
            </div>
          </>
=======
          <h2 className="text-2xl font-bold mb-4">Upload Mask Image</h2>
          <p className="text-gray-600 mb-4">Please upload a clear front view of your mask:</p>
          
          <div className="border p-4 rounded mb-4">
            <input 
              type="file" 
              onChange={handleImageUpload} 
              className="mb-2"
              accept="image/*"
            />
            {maskImage && (
              <div className="mt-4">
                <img 
                  src={maskImage} 
                  alt="Mask" 
                  className="max-w-md mx-auto rounded shadow-lg" 
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleAnalysis} 
            disabled={!maskImage}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              !maskImage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
          >
            {!maskImage ? 'Please Upload an Image' : 'Analyze Mask'}
          </button>
        </div>

        {aiPrediction && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">AI Analysis Results</h2>
            
            <div className="space-y-6">
              {aiPrediction.predictions.map((pred, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">
                      {`${index + 1}. ${pred.region}/${pred.tribalGroup}`}
                    </span>
                    <span>{(pred.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        index === 0 ? 'bg-green-600' : 
                        index === 1 ? 'bg-blue-600' : 'bg-yellow-600'
                      }`}
                      style={{width: `${pred.probability * 100}%`}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
>>>>>>> 629a0c6 (Initial commit)
        )}

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Submit to Blockchain</h2>
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            placeholder="Name your Mask"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          />
          <button 
            onClick={handleSubmitMask}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Submit Mask
          </button>
          {status && <p className="mt-4">{status}</p>}
        </div>
      </div>
    </main>
  );
}