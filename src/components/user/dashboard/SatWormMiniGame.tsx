'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Gamepad2, Loader2, RefreshCw, Sparkles, Trophy, X, Zap } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { userApi } from '@/store/services/userApi';
import { requestRewardedContinue } from '@/lib/rewardedContinue';

type SatWormResult = {
  score?: number;
  bestScore?: number;
  satsEarned?: number;
  xpEarned?: number;
  foodEaten?: number;
  elapsed?: number;
  violationCount?: number;
  restartCount?: number;
  reviveUsed?: boolean;
};

type ClaimResponse = {
  message?: string;
  reward?: {
    satsEarned: number;
    xpEarned: number;
  };
};

type ContinueRequestPayload = {
  type: 'SAT_WORM_CONTINUE_REQUEST';
  score?: number;
  reason?: string;
};

interface SatWormMiniGameProps {
  onRewardClaimed?: () => void;
  onExit?: () => void;
  fullscreen?: boolean;
}

export default function SatWormMiniGame({ onRewardClaimed, onExit, fullscreen = false }: SatWormMiniGameProps) {
  const dispatch = useAppDispatch();
  const [lastResult, setLastResult] = useState<SatWormResult | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [continuePrompt, setContinuePrompt] = useState<ContinueRequestPayload | null>(null);
  const [isGrantingContinue, setIsGrantingContinue] = useState(false);
  const claimedRunRef = useRef<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const processResult = async (detail: SatWormResult) => {
      if (!detail || typeof detail !== 'object') return;

      setLastResult(detail);
      setHasEnded(true);

      const runKey = JSON.stringify({
        score: detail.score || 0,
        satsEarned: detail.satsEarned || 0,
        xpEarned: detail.xpEarned || 0,
        elapsed: detail.elapsed || 0,
      });

      if (claimedRunRef.current === runKey) return;

      if ((detail.xpEarned || 0) <= 0) {
        setClaimMessage('Play again to unlock XP rewards.');
        return;
      }

      const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      if (!token) {
        setClaimMessage('Sign in again to claim your SAT-WORM XP.');
        return;
      }

      setIsClaiming(true);
      setClaimMessage('Claiming your SAT-WORM XP...');

      try {
        const response = await dispatch(
          userApi.endpoints.claimSatWormReward.initiate({
            score: detail.score || 0,
            bestScore: detail.bestScore || 0,
            satsEarned: detail.satsEarned || 0,
            xpEarned: detail.xpEarned || 0,
            foodEaten: detail.foodEaten || 0,
            elapsed: detail.elapsed || 0,
            violationCount: detail.violationCount || 0,
            restartCount: detail.restartCount || 0,
            reviveUsed: Boolean(detail.reviveUsed),
          })
        ).unwrap() as ClaimResponse;

        claimedRunRef.current = runKey;
        const xp = response.reward?.xpEarned ?? detail.xpEarned ?? 0;
        setClaimMessage(`Reward added: +${xp} XP`);
        onRewardClaimed?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to claim SAT-WORM XP.';
        setClaimMessage(message);
      } finally {
        setIsClaiming(false);
      }
    };

    const handleResult = async (event: Event) => {
      const customEvent = event as CustomEvent<SatWormResult>;
      await processResult(customEvent.detail || {});
    };

    const handleMessage = async (event: MessageEvent) => {
      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'SAT_WORM_CONTINUE_REQUEST') {
        setContinuePrompt(data as ContinueRequestPayload);
        setClaimMessage('Continue available. Use rewarded continue to revive this run.');
        return;
      }

      if (data.type !== 'SAT_WORM_RESULT') return;

      await processResult(data as SatWormResult);
    };

    window.addEventListener('satWormResult', handleResult as EventListener);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('satWormResult', handleResult as EventListener);
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, onRewardClaimed]);

  const grantContinue = async () => {
    setIsGrantingContinue(true);
    setClaimMessage('Preparing rewarded continue...');

    const result = await requestRewardedContinue();

    if (!result.granted) {
      setIsGrantingContinue(false);
      setClaimMessage('Rewarded continue was not completed.');
      return;
    }

    iframeRef.current?.contentWindow?.postMessage({ type: 'SAT_WORM_CONTINUE_GRANTED' }, '*');
    setContinuePrompt(null);
    setIsGrantingContinue(false);
    setClaimMessage(`Continue granted via ${result.provider}. Finish the revived run to claim XP.`);
  };

  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-sats-orange-500/20 rounded-[24px] p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-40 h-40 bg-sats-orange-500/10 blur-[44px] pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sats-orange-500/15 border border-sats-orange-500/30 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-sats-orange-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">SAT-WORM</h2>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Mini Game Arena</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 max-w-2xl">
            Play SAT-WORM and claim earned XP automatically when a run ends. XP is capped at 5 per run.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            claimedRunRef.current = null;
            setClaimMessage('');
            setLastResult(null);
            setHasEnded(false);
            setReloadKey((value) => value + 1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#171717] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload
        </button>
      </div>

      {fullscreen && onExit && (
        <div className="relative z-10 flex justify-end mb-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#171717] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Exit Game
          </button>
        </div>
      )}

      <div className="relative z-10 rounded-[20px] overflow-hidden border border-[#1d1d1d] bg-black">
        <iframe
          ref={iframeRef}
          key={reloadKey}
          src="/sat-worm.html"
          title="SAT-WORM Mini Game"
          className={`w-full bg-black ${fullscreen ? 'h-[calc(100vh-220px)] min-h-[720px]' : 'h-[760px]'}`}
        />
      </div>

      {continuePrompt && (
        <div className="relative z-10 mt-4 rounded-[20px] border border-sats-orange-500/25 bg-[#090909] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Rewarded Continue</p>
              <h3 className="mt-1 text-lg font-black text-white">Revive this SAT-WORM run</h3>
              <p className="mt-1 text-sm text-gray-400">
                Use separate rewarded continue logic for the game. This stays independent from AdSense platform ads.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setContinuePrompt(null)}
                className="rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#171717] hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={grantContinue}
                disabled={isGrantingContinue}
                className="rounded-xl border border-sats-orange-500/30 bg-sats-orange-500/10 px-4 py-2 text-sm font-bold text-sats-orange-300 hover:bg-sats-orange-500/15 transition-colors disabled:opacity-60"
              >
                {isGrantingContinue ? 'Loading Ad...' : 'Watch Ad to Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mt-4 rounded-[18px] border border-[#1d1d1d] bg-[#090909] px-4 py-3 text-sm text-gray-300 flex items-center gap-3 min-h-[56px]">
        {isClaiming ? <Loader2 className="w-4 h-4 animate-spin text-sats-orange-500 shrink-0" /> : <Zap className="w-4 h-4 text-sats-orange-500 shrink-0" />}
        <span>{claimMessage || 'Finish a run to sync XP and push a notification into your account.'}</span>
      </div>

      {fullscreen && hasEnded && onExit && (
        <div className="relative z-10 mt-4 flex justify-end">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border border-sats-orange-500/30 bg-sats-orange-500/10 px-4 py-3 text-sm font-bold text-sats-orange-300 hover:bg-sats-orange-500/15 transition-colors"
          >
            <X className="w-4 h-4" />
            Exit After Game End
          </button>
        </div>
      )}
    </div>
  );
}
