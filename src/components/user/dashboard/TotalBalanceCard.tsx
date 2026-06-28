'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Wallet, Clock, Lock, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface Balances {
  available: number;
  availableMsats?: number;
  pending: number;
  pendingMsats?: number;
  locked: number;
  totalLifetime: number;
}

export default function TotalBalanceCard({ balances }: { balances: Balances }) {
  const availableDisplayValue = (balances?.available || 0) + ((balances?.availableMsats || 0) / 1000);
  const pendingDisplayValue = (balances?.pending || 0) + ((balances?.pendingMsats || 0) / 1000);
  const totalBalance = availableDisplayValue + pendingDisplayValue + (balances?.locked || 0);

  const formatSats = (amount: number) => {
    if (!Number.isFinite(amount)) return '0';
    if (Number.isInteger(amount)) return amount.toLocaleString();
    return amount.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  };

  return (
    <div className="relative bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 overflow-hidden shadow-2xl transition-all duration-500 hover:border-sats-orange-500/30 group">
      
      {/* Background Gradient & Floating Icon */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sats-orange-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-sats-orange-500/10"></div>
      <div className="absolute top-8 right-8 w-12 h-12  items-center justify-center hidden sm:flex transition-transform duration-500 group-hover:scale-110">
        {/* <Zap className="w-8 h-8 text-sats-orange-500" fill="currentColor" /> */}
         <Image width={120} height={120} src='/icon.png' alt='logo' className='rounded-2xl'></Image>
      </div>

      <div className="relative z-10">
        {/* Header - Clean Text Only */}
        <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Total Balance
        </h2>

        {/* Huge Balance Display (No USD) */}
        <div className="mb-10">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-5xl sm:text-6xl font-black text-white tracking-tighter transition-all">
              {formatSats(totalBalance)}
            </h3>
            <span className="text-xl sm:text-2xl font-extrabold text-sats-orange-500">sats</span>
          </div>
        </div>

        {/* 4 Mini Balance Readouts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MiniBalanceBox title="Available" amount={availableDisplayValue} icon={<Wallet className="w-4 h-4 text-sats-orange-500" />} />
          <MiniBalanceBox title="Pending" amount={pendingDisplayValue} icon={<Clock className="w-4 h-4 text-yellow-500" />} />
          <MiniBalanceBox title="Locked" amount={balances?.locked || 0} icon={<Lock className="w-4 h-4 text-orange-700" />} />
          <MiniBalanceBox title="Total Earned" amount={balances?.totalLifetime || 0} icon={<TrendingUp className="w-4 h-4 text-green-500" />} />
        </div>

        {/* Full Width Withdraw Button */}
        <Link 
          href="/user/wallet" 
          className="w-full flex items-center justify-center bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-base py-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(249,115,22,0.25)] active:scale-[0.99]"
        >
          Withdraw Bitcoin
        </Link>
      </div>
    </div> 
  );
}

// Mini Component just for the TotalBalanceCard
function MiniBalanceBox({ title, amount, icon }: { title: string, amount: number, icon: React.ReactNode }) {
  const formattedAmount = Number.isInteger(amount)
    ? amount.toLocaleString()
    : amount.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');

  return (
    <div className="bg-sats-black-950 border border-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-sats-orange-500/40 hover:bg-[#0a0a0a]">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[12px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className="p-1.5 bg-black rounded-lg border border-[#1a1a1a] shadow-inner">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-white">{formattedAmount}</span>
        <span className="text-xs font-bold text-gray-400">sats</span>
      </div>
    </div>
  );
}
