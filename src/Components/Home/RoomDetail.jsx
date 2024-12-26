import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/authProvider';
import { format } from 'date-fns';
import { Modal, Button } from 'daisyui';

const RoomDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`http://localhost:5000/rooms/${id}`)
            .then(res => res.json())
            .then(data => setRoom(data))
            .catch(error => console.error("Error fetching room details:", error));

        // fetch(`http://localhost:5000/rooms/${id}/reviews`)
        //     .then(res => res.json())
        //     .then(data => setReviews(data))
        //     .catch(error => console.error("Error fetching reviews:", error));
    }, [id]);


    const handleBooking = () => {
        if (!user) {
            alert("You need to be logged in to book a room.");
            navigate("/login");
            return;
        }

        fetch(`http://localhost:5000/rooms/${id}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                setRoom(prev => ({ ...prev, availability: false }));
                setModalOpen(false);
            })
            .catch(error => console.error("Error booking room:", error));
    };

    if (!room) return <p>Loading...</p>;

    return (
        <div className="room-detail">
            <img src={room.image} alt={room.name} className="w-full h-64 object-contain" />
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <p>{room.description}</p>
            <p>Price: ${room.price} / night</p>
            <p>Rating: ⭐ {room.rating}</p>
            <p>Room ID: {room.id}</p>
            <p>{room.availability ? "Available" : "Unavailable"}</p>


            {user && (
                <div className="reviews">
                    <h2 className="text-xl font-semibold mt-6">Reviews:</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index} className="border p-2 my-2">
                                    <strong>{review.user}</strong> (⭐ {review.rating}): {review.comment}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews available for this room.</p>
                    )}
                </div>
            )}

            {/* Book Now button for logged-in users */}
            {room.availability && user && (
                <button
                    onClick={() => document.getElementById('my_modal_5').showModal()} //  modal button 
                    className="bg-[#DDA15E] text-[#3F0113] mt-4 px-6 py-2 btn hover:bg-[#3F0113] hover:text-[#BC6C25]"
                >
                    Book Now
                </button>
            )}
            {room.availability && !user && (
                <button
                    onClick={() => navigate("/login")}
                    className="bg-[#DDA15E] text-[#3F0113] mt-4 px-6 py-2 btn hover:bg-[#3F0113] hover:text-[#BC6C25]"
                >
                    Please Log In to Book
                </button>
            )}

            {/* Modal for booking */}
            {/* {isModalOpen && ( */}
            {/* <Modal open={isModalOpen} onClickBackdrop={() => setModalOpen(false)}>
                <h1>Hello</h1>
                {/* <div className="p-6">
                        <h2 className="text-2xl font-bold">Booking Summary</h2>
                        <p><strong>Room:</strong> {room.name}</p>
                        <p><strong>Price:</strong> ${room.price}</p>
                        <p><strong>Date:</strong> {format(selectedDate, 'yyyy-MM-dd')}</p>
                        <input
                            type="date"
                            className="mt-4 border p-2"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={e => setSelectedDate(new Date(e.target.value))}
                        />
                        <div className="mt-6 flex justify-end gap-4">
                            <Button color="secondary" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={handleBooking}>
                                Confirm Booking
                            </Button>
                        </div>
                    </div> */}
            {/* </Modal> */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click the button below to close</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default RoomDetail;
