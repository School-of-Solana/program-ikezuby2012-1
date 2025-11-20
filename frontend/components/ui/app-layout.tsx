'use client'

import { ReactNode, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

export function AppLayout({ children }: { children: ReactNode}) {
    return (
        <div>
            <Suspense
                fallback={
                    <div className="text-center my-32">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                }
            >
                {children}
            </Suspense>
            <Toaster position="bottom-right" />
          
        </div>
    );
};

