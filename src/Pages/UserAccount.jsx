import React, { useState } from 'react';
import { Bell, Package, Truck, CheckCircle, User, CreditCard, Lock, AlertCircle } from 'lucide-react';

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your Tesla Model 3 has been shipped!', date: '2 hours ago', read: false },
    { id: 2, message: 'Payment confirmed for BMW X5 by commercial dept.', date: '1 day ago', read: false },
    { id: 3, message: 'Your Mercedes C-Class is ready for pickup', date: '3 days ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const orders = [
    {
      id: 'ORD-2024-001',
      car: 'Tesla Model 3',
      model: 'Long Range',
      price: '$45,990',
      date: '15 Oct 2024',
      phase: 'Shipping',
      status: 'shipping',
      progress: 60,
      confirmedBy: 'John Smith'
    },
    {
      id: 'ORD-2024-002',
      car: 'BMW X5',
      model: 'xDrive40i',
      price: '$62,500',
      date: '22 Oct 2024',
      phase: 'Shipped',
      status: 'shipped',
      progress: 100,
      confirmedBy: 'Sarah Johnson'
    },
    {
      id: 'ORD-2024-003',
      car: 'Mercedes C-Class',
      model: 'C300 4MATIC',
      price: '$48,900',
      date: '28 Oct 2024',
      phase: 'Ready for Pickup',
      status: 'ready',
      progress: 100,
      confirmedBy: 'Mike Davis'
    }
  ];

  const billingDetails = [
    {
      orderId: 'ORD-2024-001',
      car: 'Tesla Model 3',
      totalPrice: 45990,
      amountPaid: 20000,
      remaining: 25990,
      payments: [
        { date: '15 Oct 2024', amount: 10000, method: 'Bank Transfer', status: 'Completed' },
        { date: '20 Oct 2024', amount: 10000, method: 'Bank Transfer', status: 'Completed' }
      ]
    },
    {
      orderId: 'ORD-2024-002',
      car: 'BMW X5',
      totalPrice: 62500,
      amountPaid: 62500,
      remaining: 0,
      payments: [
        { date: '22 Oct 2024', amount: 30000, method: 'Bank Transfer', status: 'Completed' },
        { date: '25 Oct 2024', amount: 32500, method: 'Bank Transfer', status: 'Completed' }
      ]
    },
    {
      orderId: 'ORD-2024-003',
      car: 'Mercedes C-Class',
      totalPrice: 48900,
      amountPaid: 15000,
      remaining: 33900,
      payments: [
        { date: '28 Oct 2024', amount: 15000, method: 'Bank Transfer', status: 'Completed' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'shipping': return 'text-blue-600 bg-blue-50';
      case 'shipped': return 'text-orange-600 bg-orange-50';
      case 'ready': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'shipping': return <Truck className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              CM
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Carlos Martinez</h3>
              <p className="text-xs text-green-600">Available</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">General</p>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === 'billing' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Billing</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Account</p>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === 'account' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account</h1>
            <p className="text-sm text-gray-500">Dashboard &gt; User &gt; Account Settings</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setNotifications(notifications.map(n =>
                          n.id === notif.id ? { ...n, read: true } : n
                        ));
                      }}
                    >
                      <p className="text-sm text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'orders' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">My Orders</h2>
                <p className="text-gray-600">Track your confirmed car orders</p>
                <div className="mt-3 flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>All orders require commercial department confirmation before processing</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phase</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Confirmed By</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{order.car}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{order.model}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{order.price}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.phase}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{order.confirmedBy}</p>
                          <p className="text-xs text-gray-500">Commercial</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress Details Section */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Phases Explained</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Shipping</p>
                      <p className="text-xs text-gray-600 mt-1">Vehicle is being transported to your location</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Shipped</p>
                      <p className="text-xs text-gray-600 mt-1">Vehicle has arrived at the delivery center</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Ready for Pickup</p>
                      <p className="text-xs text-gray-600 mt-1">Vehicle is ready for you to collect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing Overview</h2>
                <p className="text-gray-600">View your payment history and remaining balances</p>
                <div className="mt-3 flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>All payments are processed offline through the commercial department. This is a view-only summary.</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${billingDetails.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${billingDetails.reduce((sum, order) => sum + order.amountPaid, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${billingDetails.reduce((sum, order) => sum + order.remaining, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6">
                {billingDetails.map((order, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.car}</h3>
                          <p className="text-sm text-gray-500">{order.orderId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="text-xl font-bold text-gray-900">${order.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Payment Progress</span>
                          <span className="font-medium text-gray-900">
                            {Math.round((order.amountPaid / order.totalPrice) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(order.amountPaid / order.totalPrice) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-green-600 font-medium">
                            Paid: ${order.amountPaid.toLocaleString()}
                          </span>
                          <span className="text-orange-600 font-medium">
                            Remaining: ${order.remaining.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Payment History */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                        <div className="space-y-2">
                          {order.payments.map((payment, pIndex) => (
                            <div key={pIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{payment.method}</p>
                                  <p className="text-xs text-gray-500">{payment.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                  ${payment.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-green-600">{payment.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.remaining > 0 && (
                        <div className="mt-4 flex items-center space-x-2 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p>Remaining balance of ${order.remaining.toLocaleString()} to be paid. Contact commercial department for payment arrangements.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 flex items-start space-x-2">
                  <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>For payment processing, installment plans, or billing inquiries, please contact the commercial department at <span className="font-semibold">commercial@autoverse.com</span> or call <span className="font-semibold">+1 (555) 123-4567</span></span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Information</h2>
                <p className="text-gray-600">Your account credentials (read-only)</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        value="carlos.martinez@autoverse.com"
                        disabled
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                      />
                      <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value="••••••••••••"
                        disabled
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                      />
                      <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password cannot be changed</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value="Carlos Martinez"
                          disabled
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input
                          type="text"
                          value="January 2024"
                          disabled
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;