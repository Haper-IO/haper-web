import {reqHandler} from "@/lib/requests/client/base";
import {BillingCycle} from "@/lib/checkout";


export const newCheckoutSession = async (billingCycle: BillingCycle, returnUrl: string) => {
  return reqHandler.post<{checkout_session_client_secret: string}>('/checkout/session', {
    return_url: returnUrl,
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
