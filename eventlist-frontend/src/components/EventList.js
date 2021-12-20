import React, { useState, useEffect } from "react";

const EventList = ({ location }) => {
	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem(location.state.username));
		console.log(userInfo);
		setToken(userInfo.token);
		setUserId(userInfo.id);
		const getEvents = async () => {
			const resp = await fetch("http://localhost:4000/api/event", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userInfo.token}`,
				},
			});
			const d = await resp.json();
			console.log(d);

			setEvents(d.result);
		};

		getEvents();
	}, []);
	const [events, setEvents] = useState([]);
	const [canEdit, setCanEdit] = useState(true);
	const [editNewEvent, setEditNewEvent] = useState(false);
	const [newItem, setNewItem] = useState({});
	//user auth
	const [token, setToken] = useState(undefined);
	const [userId, setUserId] = useState(undefined);

	const changeAction = () => {
		setCanEdit(!canEdit);
	};

	const changeInput = (index, col, e) => {
		const newEvent = events;
		newEvent[index][col] = e.target.value;
		setEvents([...newEvent]);
	};

	const changeNewItemInput = (col, e) => {
		const newNewItem = newItem;
		newNewItem[col] = e.target.value;
		setNewItem(newNewItem);
	};


	const handleAdd = async () => {
		const data = {
			from: newItem.from,
			to: newItem.to,
			content: newItem.content,
			isCompleted: false,
		};

		try {
			const resp = await fetch("http://localhost:4000/api/event", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});

			const d = await resp.json();
			const newTodos = events;
			newTodos.push(data);
			setEvents([...newTodos]);
			console.log(d);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async (index) => {
		const deletedTodo = events[index];
		const newTodo = events;
		newTodo.splice(index, 1);
		setEvents([...newTodo]);

		try {
			fetch(`http://localhost:4000/api/event/${deletedTodo["_id"]}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdate = async (index) => {
		const data = {
			from: events[index]["from"],
			to: events[index]["to"],
			content: events[index]["content"],
			creator: userId,
		};
		console.log(data);
		const updatedTodo = events[index];
		try {
			fetch(`http://localhost:4000/api/event/${updatedTodo["_id"]}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});
		} catch (error) {
			console.log(error);
		}
		changeAction();
	};

	return (
		<div>
			<button onClick={() => setEditNewEvent(!editNewEvent)}>Add Event</button>
			{editNewEvent ? (
				<ul>
					<li>
						<div style={{ display: "inline" }}>
							<input
								type="text"
								onChange={(event) => changeNewItemInput("from", event)}
							/>
							<input
								type="text"
								onChange={(event) => changeNewItemInput("to", event)}
							/>
							<input
								type="text"
								onChange={(event) => changeNewItemInput("content", event)}
							/>
							<button onClick={handleAdd}>Save</button>
						</div>
					</li>
				</ul>
			) : null}
			<ul>
				{events.map((item, index) => (
					<li key={index}>
						{canEdit ? (
							<div style={{ display: "inline" }}>
								{item.from} {item.to} {item.content} {item.isCompleted}
								<button onClick={changeAction}>Edit</button>
							</div>
						) : (
							<div style={{ display: "inline" }}>
								<input
									onChange={(event) => changeInput(index, "from", event)}
									type="text"
									value={item.from}
								/>
								<input
									onChange={(event) => changeInput(index, "to", event)}
									type="text"
									value={item.to}
								/>
								<input
									onChange={(event) => changeInput(index, "content", event)}
									type="text"
									value={item.content}
								/>
								<input
									onChange={(event) => changeInput(index, "isCompleted", event)}
									type="text"
									value={item.isCompleted}
								/>
								<button onClick={() => handleUpdate(index)}>Save</button>
								<button onClick={() => handleDelete(index)}>Delete</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default EventList;
