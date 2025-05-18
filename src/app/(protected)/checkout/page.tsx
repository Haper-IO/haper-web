'use client'

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {env} from "next-runtime-env";
import {useEffect, useState} from "react";
import {newCheckoutSession} from "@/lib/requests/client/checkout";
import {redirect} from "next/navigation";


const stripePromise = loadStripe(env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")!)

export default function Checkout() {

  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const returnURL = new URL("/checkout-result", env("NEXT_PUBLIC_SITE_HOST_URL"));
    newCheckoutSession("month", returnURL.toString()).then((resp) => {
      setCheckoutClientSecret(resp.data.checkout_session_client_secret)
    }).catch(() => {
      setTimeout(() => {
        redirect("/dashboard")
      }, 1000)
    })
  }, [])

  if (!checkoutClientSecret) {
    return null
  }

  return (
    <section className="w-screen h-screen flex items-center justify-center">
      <div id="checkout" className="w-[70%] py-4 rounded-lg bg-white">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            clientSecret: checkoutClientSecret, // Replace with your actual client secret
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </section>

  )
}
