import {reqHandler} from "@/lib/requests/client/base";
import {env} from "next-runtime-env";
import {BillingCycle} from "@/lib/checkout";


export const newCheckoutSession = async (billingCycle: BillingCycle) => {
  const returnURL = new URL("/checkout-result", env("NEXT_PUBLIC_SITE_HOST_URL"));
  return reqHandler.post<{checkout_session_client_secret: string}>('/checkout/session', {
    return_url: returnURL.toString(),
    billing_cycle: billingCycle,
  });
}

export const getCheckoutStatus = async (sessionId: string) => {
  return reqHandler.get<{checkout_status: string, customer_email: string}>(`/checkout/session-status`, {
    params: {
      session_id: sessionId,
    }
  });
}
