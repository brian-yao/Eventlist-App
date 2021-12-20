import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const signUpHandler = async (user, pass) => {
	const data = {
		username: user,
		password: pass,
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
		//give user a meaningful message based on successful signup, give error message if fail (username not unique)
		alert(d.message);
		//if d.message = "User created!" then redirect to the login page (also be sure to save the id)
	} catch (error) {
		alert("Sorry, backend may be down. Please try again later.");
		console.log(error);
	}
};

export default function SignUp() {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const userData = {
			username: data.get("username"),
			password: data.get("password"),
			password2: data.get("password2"),
		};
		if (userData.password !== userData.password2) {
			alert("Please enter the same password in both fields.");
		} else {
			//query the api and get a response
			signUpHandler(userData.username, userData.password);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password2"
									label="Repeat Password"
									type="password"
									id="repeat-password"
								/>
							</Grid>
						</Grid>
						<Button
							onSubmit={handleSubmit}
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="#" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
