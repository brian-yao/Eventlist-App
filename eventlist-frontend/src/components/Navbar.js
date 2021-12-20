import * as React from "react";
import { Link } from "react-router-dom";

//Material UI stuff
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const NavBar = () => {
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ mr: 2, display: { xs: "flex", md: "flex" }, flex: 5 }}
					>
						Event List
					</Typography>
					<Box sx={{ mx: "auto", width: 100 }}>
						<Link
							style={{ color: "white", textDecoration: "none" }}
							to="/login"
						>
							LOGIN
						</Link>
					</Box>
					<Box sx={{ mx: "auto", width: 100 }}>
						<Link style={{ color: "white", textDecoration: "none" }} to="/">
							SIGNUP
						</Link>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default NavBar;
