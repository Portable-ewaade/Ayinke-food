import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";

const DelModal = ({ isShow, closeModal, handleDelete }) => {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0);
	const [msgData, setMsgData] = useState({
		type: "",
		message: "",
		title: "",
	});

	const doDelete = async () => {
		try {
			setLoading(true);
			await handleDelete();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			throw error;
		}
	};

	// useEffect(() => {}, []);

	// const fireDelete = async (e) => {
	// 	if (e) e.preventDefault();
	// 	const result = await remove();

	// 	if (result === true) {
	// 		setStep(1);
	// 	}
	// };

	// const close = (e) => {
	// 	if (e) e.preventDefault();
	// };

	const Message = () => {
		return (
			<>
				<h3
					className={`fs-15 font-weight-medium font-metropolisregular ${
						msgData.type === "success" ? "onapple" : "onaliz"
					}`}
				>
					{msgData.message}
				</h3>

				<p className="fs-14 onmineshaft mrgb0">{msgData.message}</p>

				<div className="mrgt2">
					<button
						// onClick={(e) => close(e)}
						className="btn bg-silver btn-block fs-14 onmineshaft fon-metropolisregular"
					>
						OK
					</button>
				</div>
			</>
		);
	};

	return (
		<>
			<Modal
				show={isShow}
				onHide={closeModal}
				size="sm"
				fade={false}
				keyboard={false}
				aria-labelledby="small-modal"
				centered
				className="custom-modal rem-modal"
			>
				<Modal.Body>
					<div className="modal-box">
						<div className="modal-sidebar"></div>

						<div className="modal-content-box">
							<div className="modal-header-box">
								<h2 className="font-metropolisregular fs-16">Delete </h2>
								<div className="ml-auto">
									<button
										onClick={closeModal}
										className="dot-close fe-order"
										style={{ position: "relative", top: "-3px" }}
									>
										<span className="fe fe-x on-cord-o fs-13"></span>
									</button>
								</div>
							</div>

							<div className="modal-content-area">
								{step === 0 && (
									<>
										<p className="fs-15 font-weight-bold ui-text-center font-metropolisregular">
											Are you sure you want to delete ?
										</p>

										<div className="form-group mrgt2">
											<div className="row">
												<div className="col-md-6">
													<button
														onClick={closeModal}
														className="btn bg-silver btn-block fs-14 onmineshaft font-metropolisregular"
													>
														Cancel
													</button>
												</div>
												<div className="col-md-6">
													<button
														onClick={doDelete}
														className="btn btn-block fs-14 onwhite btn-danger"
													>
														{loading ? (
															<img
																src="../../../images/assets/spinner-white.svg"
																alt="spinner"
																width="30px"
															/>
														) : (
															"Yes"
														)}
													</button>
												</div>

												{/* <div className="col-md-6">
                                                    {
                                                        loading &&
                                                        <Link className={`btn btn-block fs-14 onwhite disabled ${actionType === 'success' ? 'bg-apple' : 'btn-danger'}`}>loading...</Link>
                                                    }
                                                    {
                                                        !loading &&
                                                        <Link onClick={(e) => fireDelete(e)} className={`btn btn-block fs-14 onwhite ${actionType === 'success' ? 'bg-apple' : 'btn-danger'}`}>Yes</Link>
                                                    }
                                                </div> */}
											</div>
										</div>
									</>
								)}
								{step === 1 && <Message />}
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default DelModal;
