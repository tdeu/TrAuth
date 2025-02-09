"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Tribal Authentica</h1>
          <p className="text-xl mb-8">Authenticate, Track, and Learn about African Masks</p>
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">For Mask Owners</h2>
              <ul className="list-disc list-inside mb-4">
                <li>Verify authenticity</li>
                <li>Identify ethnic origin</li>
                <li>Learn mask history</li>
                <li>Register on blockchain</li>
                <li>Get NFT of your mask</li>
              </ul>
              <div className="card-actions justify-end">
                <Link href="/authentication" className="btn">Authenticate My Mask</Link>
              </div>
            </div>
          </div>

          <div className="card bg-secondary text-secondary-content">
            <div className="card-body">
              <h2 className="card-title">For Experts</h2>
              <ul className="list-disc list-inside mb-4">
                <li>Share your expertise</li>
                <li>Earn tokens</li>
                <li>Validate mask authenticity</li>
                <li>Contribute to mask history</li>
              </ul>
              <div className="card-actions justify-end">
                <Link href="/validator-dashboard" className="btn">Start Validating</Link>
              </div>
            </div>
          </div>

          <div className="card bg-accent text-accent-content">
            <div className="card-body">
              <h2 className="card-title">For Collectors</h2>
              <ul className="list-disc list-inside mb-4">
                <li>Browse authenticated masks</li>
                <li>Purchase NFT masks</li>
                <li>Learn about African art</li>
                <li>Build your digital collection</li>
              </ul>
              <div className="card-actions justify-end">
                <Link href="/marketplace" className="btn">Explore Marketplace</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-base-200 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center">Learn to Earn</h2>
          <p className="text-center mb-6">Expand your knowledge about African masks and earn tokens while doing so!</p>
          <div className="text-center">
            <Link href="/learn" className="btn btn-primary btn-lg">Start Learning</Link>
          </div>
        </section>

        <section className="text-center bg-base-300 p-8 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6">Connect with mask enthusiasts, experts, and collectors from around the world</p>
          <Link href="/community" className="btn btn-outline btn-lg">
            Join Now
          </Link>
        </section>
      </main>

      <footer className="w-full bg-neutral text-neutral-content p-4 text-center">
        <p>© 2024 Tribal Authentica. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;