using ClinicBooking.Application.Interfaces;

namespace ClinicBooking.Infrastructure.Payments
{
    public class MockPaymentGateway : IPaymentGateway
    {
        public string GatewayName => "Mock";

        public Task<PaymentInitiationResult> InitiatePaymentAsync(
            Guid paymentId, decimal amount, string currency, string callbackUrl)
        {
            // A real gateway would call an external API here and get back a redirect URL.
            // The mock simulates this by generating a fake reference and pointing to our own
            // mock payment page, which lets us test the full flow without any real gateway.
            var reference = $"MOCK-{Guid.NewGuid():N}";

            var redirectUrl = $"{callbackUrl}?paymentId={paymentId}&reference={reference}&mock=true";

            return Task.FromResult(new PaymentInitiationResult
            {
                Success = true,
                RedirectUrl = redirectUrl,
                GatewayReferenceId = reference
            });
        }

        public Task<PaymentVerificationResult> VerifyPaymentAsync(
            string gatewayReferenceId, IDictionary<string, string> callbackParameters)
        {
            // In a real gateway, this would call their API to confirm the payment actually succeeded.
            // The mock trusts a "status" parameter passed back from our own fake payment page.
            var succeeded = callbackParameters.TryGetValue("status", out var status) && status == "success";

            return Task.FromResult(new PaymentVerificationResult
            {
                Success = succeeded,
                TransactionId = succeeded ? gatewayReferenceId : null,
                ErrorMessage = succeeded ? null : "Payment was not completed."
            });
        }
    }
}