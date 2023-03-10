import React, { Suspense } from "react";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";

import MainLoader from "./components/helpers/MainLoader";
import DashboardLayout from "./components/layouts/Dashboard";

//context api states
import UserState from "./context/user/userState";
import LocationState from "./context/location/locationState";
import AddressState from "./context/address/addressState";
import FoodState from "./context/food/foodState";
import FoodItemState from "./context/foodItem/foodItemState";
import { loggedIn } from "./utils/storage/auth";

//
// components: lazyload pages
// const MainLoader = React.lazy(() => import('./components/helpers/MainLoader'));
const Home = React.lazy(() => import("./components/pages/Home"));
const RestDetails = React.lazy(() =>
	import("./components/pages/restaurant/RestDetails")
);
const Plates = React.lazy(() => import("./components/pages/order/Plates"));
const Search = React.lazy(() => import("./components/pages/search/Search"));
const ConfirmOrder = React.lazy(() =>
	import("./components/pages/order/Confirm")
);

const Login = React.lazy(() => import("./components/pages/auth/Login"));
const FoodList = React.lazy(() => import("./components/pages/FoodList"));
const Register = React.lazy(() => import("./components/pages/auth/Register"));
const ForgotPassword = React.lazy(() =>
	import("./components/pages/auth/ForgotPassword")
);
const ResetPassword = React.lazy(() =>
	import("./components/pages/auth/ResetPassword")
);
const About = React.lazy(() => import("./components/pages/About"));
const Feedback = React.lazy(() => import("./components/pages/Feedback"));

const Dashboard = React.lazy(() =>
	import("./components/pages/dashboard/Dashboard")
);
const Account = React.lazy(() =>
	import("./components/pages/dashboard/Account")
);

const Orders = React.lazy(() => import("./components/pages/dashboard/Orders"));
const Locations = React.lazy(() =>
	import("./components/pages/dashboard/Locations")
);
const FoodItems = React.lazy(() =>
	import("./components/pages/dashboard/FoodItems")
);
const AddFood = React.lazy(() =>
	import("./components/pages/dashboard/AddFood")
);
const LocationAdd = React.lazy(() =>
	import("./components/pages/dashboard/AddLocation")
);

const App = () => {
	return (
		<Router>
			<UserState>
				<FoodState>
					<FoodItemState>
						<AddressState>
							<LocationState>
								<Suspense fallback={MainLoader()}>
									<Switch>
										<Route exact path="/" component={Home} />

										{/* <Route exact path="/login" component={Login} /> */}
										<Route exact path="/food-list" component={FoodList} />
										<Route exact path="/about" component={About} />
										<Route exact path="/feedback" component={Feedback} />
										<Route exact path="/register" component={Register} />
										<Route
											exact
											path="/forgot-password"
											component={ForgotPassword}
										/>
										<Route
											exact
											path="/reset-password/:resetToken"
											component={ResetPassword}
										/>
										{/* <Route exact path="/search/:query" component={Search} /> */}
										<Route exact path="/search" component={Search} />

										<Route exact path="/order/plates" component={Plates} />

										<Route
											exact
											path="/order/confirm"
											component={ConfirmOrder}
										/>
										{/* <Route exact path="/dashboard/account" component={Account} /> */}
										<Route exact path="/admin" component={Login} />

										{/* {loggedIn && (
											<> */}
										<Route
											exact
											path="/admin/dashboard"
											component={DashboardLayout(Dashboard)}
										/>
										<Route
											exact
											path="/admin/dashboard/add-location"
											component={DashboardLayout(LocationAdd)}
										/>
										<Route
											exact
											path="/admin/dashboard/food-items"
											component={DashboardLayout(FoodItems)}
										/>
										<Route
											exact
											path="/admin/dashboard/orders"
											component={DashboardLayout(Orders)}
										/>
										<Route
											exact
											path="/admin/dashboard/locations"
											component={DashboardLayout(Locations)}
										/>

										<Route
											exact
											path="/admin/dashboard/food-items/add"
											component={DashboardLayout(AddFood)}
										/>
										{/* </>
										)} */}

										{/* put this here */}
										{/* <Route exact path="/:id" component={RestDetails} /> */}

										<Route path="*" render={() => <Redirect to="/" />} />
									</Switch>
								</Suspense>
							</LocationState>
						</AddressState>
					</FoodItemState>
				</FoodState>
			</UserState>
		</Router>
	);
};

export default App;
