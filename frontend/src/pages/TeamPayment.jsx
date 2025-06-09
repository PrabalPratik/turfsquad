import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TeamPayment() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      // Simulated team data
      const mockTeam = {
        _id: teamId,
        name: 'Mumbai Strikers',
        sport: 'Football',
        location: 'Andheri Sports Complex',
        time: new Date().toISOString(),
        pricePerSlot: 500,
        totalSlots: 10,
        filledSlots: 5
      };
      setTeam(mockTeam);
    } catch (error) {
      setError('Failed to fetch team details');
    } finally {
      setLoading(false);
    }
  };

  const handleDummyPayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate(`/teams/${teamId}`);
    }, 2000);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Team not found'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>

        <div className="border-t border-b border-gray-200 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Team Name</span>
              <span className="font-medium">{team.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sport</span>
              <span className="font-medium">{team.sport}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">{team.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">
                {new Date(team.time).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Amount to Pay</span>
              <span>₹{team.pricePerSlot}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="font-medium">UPI</div>
              <div className="text-sm text-gray-500">Google Pay, PhonePe, etc.</div>
            </button>
            <button
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="font-medium">Card</div>
              <div className="text-sm text-gray-500">Credit/Debit Card</div>
            </button>
            <button
              className={`p-4 border rounded-lg text-center ${
                paymentMethod === 'netbanking' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <div className="font-medium">Net Banking</div>
              <div className="text-sm text-gray-500">All Indian Banks</div>
            </button>
          </div>
        </div>

        {/* UPI Section */}
        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <div className="text-gray-600">Scan QR with any UPI app</div>
                <div className="text-sm text-gray-500 mt-2">or</div>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., mobile@upi)"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card Section */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Card Number"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Net Banking Section */}
        {paymentMethod === 'netbanking' && (
          <div className="space-y-4">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        )}

        <button
          onClick={handleDummyPayment}
          disabled={processing}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay ₹${team.pricePerSlot}`
          )}
        </button>

        <div className="text-center text-sm text-gray-500">
          <p>This is a dummy payment page for demonstration purposes.</p>
          <p>No actual payment will be processed.</p>
        </div>
      </div>
    </div>
  );
} 