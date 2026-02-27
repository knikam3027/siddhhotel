import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import WalletSection from '../wallet/WalletSection';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                // Fetch user profile
                const profileResponse = await ApiService.getUserProfile();
                setUser(profileResponse.user);

                // Fetch user bookings - use _id (MongoDB ID)
                if (profileResponse.user && profileResponse.user._id) {
                    const bookingsResponse = await ApiService.getUserBookings(profileResponse.user._id);
                    setBookings(bookingsResponse.bookingList || []);

                    // Fetch wallet
                    try {
                        const walletResponse = await ApiService.getWallet();
                        setWallet(walletResponse.wallet);
                    } catch (walletError) {
                        console.log('Wallet fetch error (non-critical):', walletError);
                    }
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleAddMoney = async (amount) => {
        try {
            const response = await ApiService.addMoneyToWallet(amount, 'Card Payment');
            setWallet(response.wallet);
            alert(`Successfully added ₹${amount} to wallet!`);
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {loading && <p>Loading profile...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {user && !loading && (
                <>
                    <h2>Welcome, <span style={{color: '#17a2b8'}}>{user.name}</span></h2>
                    <div className="profile-actions">
                        <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                    
                    {/* Wallet Section */}
                    {wallet && <WalletSection wallet={wallet} onAddMoney={handleAddMoney} />}
                    
                    <div className="profile-details">
                        <h3>👤 My Profile Details</h3>
                        <div className="profile-info">
                            <p><strong>📧 Email:</strong> {user.email}</p>
                            <p><strong>📱 Phone Number:</strong> {user.phoneNumber}</p>
                            <p><strong>🏷️ Role:</strong> {user.role || 'User'}</p>
                        </div>
                    </div>
                    
                    <div className="bookings-section">
                        <h3>📅 My Booking History</h3>
                        {bookings && bookings.length > 0 ? (
                            <div className="booking-list">
                                {bookings.map((booking) => (
                                    <div key={booking._id} className="booking-item" style={{border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px'}}>
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px'}}>
                                            <div>
                                                {booking.room?.roomPhotoUrl && (
                                                    <img 
                                                        src={booking.room.roomPhotoUrl} 
                                                        alt="Room" 
                                                        className="room-photo" 
                                                        style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px'}}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p><strong>✓ Confirmation Code:</strong> <span style={{color: '#28a745', fontWeight: 'bold'}}>{booking.bookingConfirmationCode}</span></p>
                                                <p><strong>🛏️ Room Type:</strong> {booking.room?.roomType}</p>
                                                <p><strong>💰 Room Price:</strong> ₹{booking.room?.roomPrice}/night</p>
                                                <p><strong>📆 Check-in:</strong> {new Date(booking.checkInDate).toDateString()}</p>
                                                <p><strong>📆 Check-out:</strong> {new Date(booking.checkOutDate).toDateString()}</p>
                                                <p><strong>👥 Total Guests:</strong> {booking.totalNumOfGuests}</p>
                                                <p><strong>💵 Payment Status:</strong> <span style={{color: '#ff9800', fontWeight: 'bold'}}>Cash - On Check-in or Wallet</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
                                No bookings yet. <a href="/rooms" style={{color: '#17a2b8', textDecoration: 'none'}}>Book a room now!</a>
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
