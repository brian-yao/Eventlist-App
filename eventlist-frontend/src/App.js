import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EventList from "./components/EventList";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Switch>
					<Route exact path="/" component={SignUp} />
					<Route path="/login" component={Login} />
					<Route path="/events" component={EventList} />
				</Switch>
				{/* <Login />
				<SignUp /> */}
			</div>
		</Router>
	);
}

export default App;
