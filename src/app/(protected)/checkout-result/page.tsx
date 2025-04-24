'use client'

import {useEffect, useState} from "react";
import {getCheckoutStatus} from "@/lib/requests/client/checkout";
import {redirect, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";


export default function CheckoutSuccessPage() {
  const searchParam = useSearchParams()
  const [checkoutStatus, setCheckoutStatus] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    const checkoutSessionID = searchParam.get('session_id')
    if (checkoutSessionID) {
      getCheckoutStatus(checkoutSessionID).then((resp => {
        setCheckoutStatus(resp.data.checkout_status)
        setCustomerEmail(resp.data.customer_email)
      }))
    }

  }, [searchParam])

  if (checkoutStatus === 'open') {
    // return redirect('/')
  }

  if (checkoutStatus === 'complete') {
    return (
      <section>
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
        <Button
          onClick={() => {
            redirect("/dashboard")
          }}
        >
          Go Back to Dashboard
        </Button>
      </section>
    )
  }
}
