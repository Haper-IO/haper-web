import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-4">
          <Link
            href="/privacy"
            className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <div className="text-center mt-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Haper, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
