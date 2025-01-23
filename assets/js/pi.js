// Initialize the Pi SDK
    Pi.init({
      appId: 'YOUR_APP_ID', // Replace with your Pi App ID
      sandbox: true,       // Set to true for testing, false for production
    });

    // Payment button functionality
    document.getElementById('pay-with-pi').addEventListener('click', () => {
      const paymentData = {
        amount: 1.0, // The amount in Pi
        memo: 'Payment for services', // Reason for the payment
        metadata: { orderId: '12345', description: 'Service payment' }, // Optional metadata
      };

      Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          console.log('Payment ready for approval:', paymentId);
          showAlert(`Payment ID: ${paymentId} is ready for server approval.`);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('Payment ready for completion:', paymentId, txid);
          showAlert(`Payment completed with Transaction ID: ${txid}`);
          
          // Send transaction data to the server for saving
          fetch('transaction.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentId: paymentId,
              txid: txid,
              amount: paymentData.amount,
              memo: paymentData.memo,
              metadata: paymentData.metadata
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Transaction saved:', data);
          })
          .catch(error => {
            console.error('Error saving transaction:', error);
          });
        },
        onCancel: (paymentId) => {
          console.log('Payment canceled:', paymentId);
          showAlert('Payment canceled.');
        },
        onError: (error) => {
          console.error('Payment error:', error);
          showAlert('An error occurred while processing the payment.');
        },
      });
    });

    function showAlert(message) {
      const alertElement = document.getElementById('alert');
      alertElement.textContent = message;
      alertElement.style.display = 'block';
      setTimeout(() => {
        alertElement.style.display = 'none';
      }, 5000);
    }
