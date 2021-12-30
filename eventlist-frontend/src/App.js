import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Eventlist from "./components/Eventlist";
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
					<Route path="/events" component={Eventlist} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
