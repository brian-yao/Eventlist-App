import React, { useState, useEffect } from "react";

const TodoList = () => {
	useEffect(() => {
		const getEvents = async () => {
			const resp = await fetch("http://localhost:4000/api/event", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplcnJ5IiwidXNlcklkIjoiNjFiY2YyYzU4YTdjZTU1NjMwY2JjMTcyIiwicm9sZSI6WyJ1c2VyIiwiYWRtaW4iXSwiaWF0IjoxNjM5Nzc3NzYwLCJleHAiOjE2Mzk3ODEzNjB9.M97r_hQWXOeJw-NsEt-1qYFf_fEmhst71k2RYGy9UbU`,
				},
			});
			const d = await resp.json();
			console.log(d);

			setTodos(d.result);
		};

		getEvents();
	}, []);
	const [todos, setTodos] = useState([]);
	const [canEdit, setCanEdit] = useState(true);
	const [newEvent, setNewEvent] = useState(false);
	const [newItem, setNewItem] = useState({});
	const [token, setToken] = useState(undefined);

	const changeAction = () => {
		setCanEdit(!canEdit);
	};

	const changeInput = (index, col, e) => {
		const newTodo = todos;
		newTodo[index][col] = e.target.value;
		setTodos([...newTodo]);
	};

	const changeNewItemInput = (col, e) => {
		const newNewtItem = newItem;
		newNewtItem[col] = e.target.value;
		setNewItem(newNewtItem);
	};

	const handleSignUp = async () => {
		const data = {
			username: "jerry",
			password: "123456",
			isAdmin: true,
		};

		try {
			const resp = await fetch("http://localhost:4000/api/user/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const d = await resp.json();
			console.log(d);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSignIn = async () => {
		const data = {
			username: "jerry",
			password: "123456",
		};

		try {
			const resp = await fetch("http://localhost:4000/api/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const d = await resp.json();
			setToken(d.data.token);
			console.log(d);
		} catch (error) {
			console.log(error);
		}
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
			const newTodos = todos;
			newTodos.push(data);
			setTodos([...newTodos]);
			console.log(d);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async (index) => {
		const deletedTodo = todos[index];
		const newTodo = todos;
		newTodo.splice(index, 1);
		setTodos([...newTodo]);

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

	return (
		<div>
			<button onClick={() => handleSignUp()}>Sign Up</button>
			<button onClick={() => handleSignIn()}>Login</button>
			{/* <button onClick={() => handleAdd(!newEvent)}>Add</button> */}
			<button onClick={() => setNewEvent(!newEvent)}>Add Event</button>
			{newEvent ? (
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
				{todos.map((todo, index) => (
					<li key={index}>
						{canEdit ? (
							<div style={{ display: "inline" }}>
								{todo.from} {todo.to} {todo.content} {todo.isCompleted}
								<button onClick={changeAction}>Edit</button>
							</div>
						) : (
							<div style={{ display: "inline" }}>
								<input
									onChange={(event) => changeInput(index, "from", event)}
									type="text"
									value={todo.from}
								/>
								<input
									onChange={(event) => changeInput(index, "to", event)}
									type="text"
									value={todo.to}
								/>
								<input
									onChange={(event) => changeInput(index, "content", event)}
									type="text"
									value={todo.content}
								/>
								<input
									onChange={(event) => changeInput(index, "isCompleted", event)}
									type="text"
									value={todo.isCompleted}
								/>
								<button onClick={changeAction}>Save</button>
								<button onClick={() => handleDelete(index)}>Delete</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;
