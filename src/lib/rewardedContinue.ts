export type RewardedContinueResult = {
  granted: boolean;
  provider: 'mock-rewarded' | 'real-provider';
};

export async function requestRewardedContinue(): Promise<RewardedContinueResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    granted: true,
    provider: 'mock-rewarded',
  };
}
