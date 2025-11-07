"use client";

import {ErrorCard} from '@/components/auth/error-card';
import {useSearchParams} from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  return (
    <ErrorCard message={searchParams.get('error_msg') ?? 'Unknown error'}/>
  );
};

