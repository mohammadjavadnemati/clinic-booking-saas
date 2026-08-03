namespace ClinicBooking.Application.Interfaces
{
    public class PaymentInitiationResult
    {
        public bool Success { get; set; }
        public string? RedirectUrl { get; set; }
        public string? GatewayReferenceId { get; set; } 
        public string? ErrorMessage { get; set; }
    }

    public class PaymentVerificationResult
    {
        public bool Success { get; set; }
        public string? TransactionId { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public interface IPaymentGateway
    {
        string GatewayName { get; }

        Task<PaymentInitiationResult> InitiatePaymentAsync(Guid paymentId, decimal amount, string currency, string callbackUrl);

        Task<PaymentVerificationResult> VerifyPaymentAsync(string gatewayReferenceId, IDictionary<string, string> callbackParameters);
    }
}