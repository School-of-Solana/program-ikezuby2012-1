'use client'

import dynamic from 'next/dynamic'
import { ReactNode, useCallback, useMemo } from 'react'
import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import toast from 'react-hot-toast'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useCluster } from '../cluster/cluster-data-access'


//require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false, loading: () => <button className='px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-[#0A344f] text-white'>Loading Wallet...</button>
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  const endpoint = useMemo(() => cluster.endpoint, [cluster])

  const network = useMemo(() => {
    switch (cluster.network) {
      case 'mainnet-beta':
        return WalletAdapterNetwork.Mainnet
      case 'testnet':
        return WalletAdapterNetwork.Testnet
      case 'devnet':
        return WalletAdapterNetwork.Devnet
      default:
        return WalletAdapterNetwork.Devnet // fallback
    }
  }, [cluster.network]);

  const wallets = useMemo(() => {
    const adapters = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ]
    return adapters.filter((wallet) => wallet.readyState === 'Installed' || wallet.readyState === 'Loadable')
  }, [network])

  const onError = useCallback((error: WalletError) => {
    if (error.name === 'WalletNotReadyError') {
      toast.error('Please install a Solana wallet like Phantom or Solflare.')
    } else {
      toast.error(error.message)
    }
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
