import React, { useState, useEffect } from "react";
import moment from "moment";
//Material UI table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Material UI Button
import Button from "@mui/material/Button";
//Material UI DateTimePicker
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Stack from "@mui/material/Stack";
import DateAdapter from "@mui/lab/AdapterMoment";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";

const formatDate = (date) => {
	let ISOdate = new Date(date);
	ISOdate.toISOString();
	return ISOdate;
};

const Eventlist = ({ location }) => {
	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem(location.state.username));
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
			// console.log(d);
			setEvents(d.result);
		};

		getEvents();
	}, []);
	const [events, setEvents] = useState([]);
	const [canEdit, setCanEdit] = useState(false);
	const [editNewEvent, setEditNewEvent] = useState(false);
	const [newItem, setNewItem] = useState({
		from: new Date().toString(),
		to: new Date().toString(),
	});
	//user auth
	const [token, setToken] = useState(undefined);
	const [userId, setUserId] = useState(undefined);

	const changeAction = () => {
		setCanEdit(!canEdit);
	};

	const changeInput = (index, col, e) => {
		const newEvent = events;
		if (moment.isMoment(e)) {
			const date = e.format();
			newEvent[index][col] = date;
		} else if (col === "isCompleted" && e.target.type === "checkbox") {
			newEvent[index][col] = e.target.checked;
		} else {
			newEvent[index][col] = e.target.value;
		}
		setEvents([...newEvent]);
	};

	const changeNewItemInput = (col, e) => {
		const newEditItem = {
			...newItem,
		};
		if (moment.isMoment(e)) {
			const date = e.format();
			newEditItem[col] = date;
		} else {
			newEditItem[col] = e.target.value;
		}
		console.log(newEditItem);
		setNewItem(newEditItem);
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
			setEditNewEvent(!editNewEvent);
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
			isCompleted: true,
		};
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
		<TableContainer component={Paper} sx={{ m: "2rem auto", maxWidth: "90%" }}>
			<Button
				onClick={() => setEditNewEvent(!editNewEvent)}
				variant="contained"
			>
				Add Event
			</Button>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>From</TableCell>
						<TableCell>To</TableCell>
						<TableCell>Content</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{editNewEvent ? (
						<TableRow>
							<TableCell>
								<LocalizationProvider dateAdapter={DateAdapter}>
									<Stack spacing={3}>
										<DateTimePicker
											label="Date&Time picker"
											value={formatDate(newItem.from)}
											onChange={(event) => {
												changeNewItemInput("from", event);
											}}
											renderInput={(params) => <TextField {...params} />}
										/>
									</Stack>
								</LocalizationProvider>
							</TableCell>
							<TableCell>
								<LocalizationProvider dateAdapter={DateAdapter}>
									<Stack spacing={3}>
										<DateTimePicker
											label="Date&Time picker"
											value={formatDate(newItem.to)}
											onChange={(event) => {
												changeNewItemInput("to", event);
											}}
											renderInput={(params) => <TextField {...params} />}
										/>
									</Stack>
								</LocalizationProvider>
							</TableCell>
							<TableCell>
								<TextField
									onChange={(event) => changeNewItemInput("content", event)}
								/>
							</TableCell>
							<TableCell>
								<input type="checkbox" />
							</TableCell>
							<TableCell>
								<Button variant="contained" onClick={handleAdd}>
									Save
								</Button>
							</TableCell>
						</TableRow>
					) : null}

					{events.map((item, index) => (
						<TableRow key={item.toString() + index}>
							{canEdit ? (
								<>
									<TableCell>
										<LocalizationProvider dateAdapter={DateAdapter}>
											<Stack spacing={3}>
												<DateTimePicker
													label="Date&Time picker"
													value={formatDate(item.from).toLocaleString()}
													onChange={(event) => {
														changeInput(index, "from", event);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
											</Stack>
										</LocalizationProvider>
									</TableCell>
									<TableCell>
										<LocalizationProvider dateAdapter={DateAdapter}>
											<Stack spacing={3}>
												<DateTimePicker
													label="Date&Time picker"
													value={formatDate(item.to).toLocaleString()}
													onChange={(event) => {
														changeInput(index, "to", event);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
											</Stack>
										</LocalizationProvider>
									</TableCell>
									<TableCell>
										<TextField
											onChange={(event) => changeInput(index, "content", event)}
											type="text"
											value={item.content}
										/>
									</TableCell>
									<TableCell>
										<input
											onChange={(event) =>
												changeInput(index, "isCompleted", event)
											}
											type="checkbox"
											checked={item.isCompleted ? true : false}
										/>
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											onClick={() => handleUpdate(index)}
										>
											Save
										</Button>
										<Button
											variant="contained"
											onClick={() => handleDelete(index)}
											color="error"
										>
											Delete
										</Button>
									</TableCell>
								</>
							) : (
								<>
									<TableCell>
										{formatDate(item.from).toLocaleString()}
									</TableCell>
									<TableCell>{formatDate(item.to).toLocaleString()}</TableCell>
									<TableCell>{item.content}</TableCell>
									<TableCell>
										{item.isCompleted ? "complete" : "incomplete"}
									</TableCell>
									<TableCell>
										<Button variant="contained" onClick={changeAction}>
											Edit
										</Button>
									</TableCell>
								</>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Eventlist;
