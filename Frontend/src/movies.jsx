import React, { useState, useEffect, useContext } from "react";
import "./CSSComponents/movies.css";
import Axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "react-modal";
import { usercontext } from "./Context/usercontext";
import "./CSSComponents/delete.css";
import DeleteIcon from "@mui/icons-material/Delete";

Modal.setAppElement("#root");

const Movies = () => {
  const [movie_name, setmoviename] = useState("");
  const [movie_rating, setmovierating] = useState(0);
  const [movie_desc, setmoviedesc] = useState("");
  const [movielist, setmovielist] = useState([]);
  const [newname, setnewname] = useState(0);
  const [newdesc, setnewdesc] = useState(0);
  const [tempname, settempname] = useState("");
  const [tempdesc, settempdesc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  //const [defaulttext, setdefaulttext] = useState("");
  const [tempid, settempid] = useState(0);

  const { userid, setuserid } = useContext(usercontext);
  const [isPopup, setPopup] = useState(false);
  const [isRatingAsc, setIsRatingAsc] = useState(null);
  const moviesListOrder = isRatingAsc
    ? movielist.sort((a, b) => (a.movie_rating < b.movie_rating ? 1 : -1))
    : movielist.sort((a, b) => (a.movie_rating > b.movie_rating ? 1 : -1));

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  // function updatedesc(num,text,text){

  //     setdefaulttext(text);
  //     setnewname(text);
  //     setnewdesc(text);
  //     settempid(num);
  //     toggleModal();
  // }

  const updatemovie = () => {
    console.log(tempid);
    Axios.put("https://planzap.herokuapp.com/updatedesc", {
      id: tempid,
      movie_name: newname,
      movie_desc: newdesc,
    }).then((response) => {
      Axios.post("https://planzap.herokuapp.com/getdata", {
        userid: userid,
      }).then((response) => {
        setmovielist(response.data);
      });

      console.log("updated");
    });
  };

  const addmovie = () => {
    if (!movie_desc || !movie_name || !movie_rating) {
      alert("Enter all the fields");
      return;
    }
    const data = Axios.post("https://planzap.herokuapp.com/create", {
      movie_name: movie_name,
      movie_rating: movie_rating,
      movie_desc: movie_desc,
      userid: userid,
    }).then(() => {
      Axios.post("https://planzap.herokuapp.com/getdata", {
        userid: userid,
      }).then((response) => {
        setmovielist(response.data);
      });
      console.log("success");
    });
    if (data) {
      setmoviedesc("");
      setmoviename("");
      setmovierating("");
    }
  };

  console.log(setuserid); //This is for removing warning only
  useEffect(() => {
    Axios.post("https://planzap.herokuapp.com/getdata", {
      userid: userid,
    }).then((response) => {
      setmovielist(response.data);
    });
  }, [userid]);

  const deletemovie = (id) => {
    Axios.delete(`https://planzap.herokuapp.com/deletemovie/${id}`).then(
      (respose) => {
        setmovielist(
          movielist.filter((val) => {
            return val.id !== id;
          })
        );
      }
    );
  };

  return (
    <div className="moviesback">
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog2"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "40vw",
            height: "55vh",
            margin: "auto",
            padding: "0",
            borderRadius: "6px",
            borderColor: "red",

            background: "white",

            paddingLeft: "15px",
            paddingTop: "15px",
          },
        }}
      >
        <div className="movie-edit">
          <p>Edit Movie</p>
          <hr />
          <label for="mname">
            <b> Movie Name</b>
          </label>
          <br />
          <input
            id="mname"
            name="moviename"
            rows="2"
            cols="40"
            maxLength="60"
            className="edit-modal"
            defaultValue={tempname}
            onChange={(event) => {
              setnewname(event.target.value);
            }}
          />
          <br />
          <br />
          <label for="mdesc">
            <b>Movie Description</b>
          </label>
          <br />
          <textarea
            id="mdesc"
            name="moviedescription"
            rows="2"
            cols="40"
            maxLength="60"
            className="edit-modal"
            defaultValue={tempdesc}
            onChange={(event) => {
              setnewdesc(event.target.value);
            }}
          ></textarea>
          <br />
          <br />
          <div
            className="douter"
            onClick={() => {
              updatemovie();
              toggleModal();
            }}
          >
            <span className="dsubmit">Save</span>
          </div>
        </div>
      </Modal>

      <div className="topbar">
        <div className="moviename">Title</div>
        <div className="movierating">
          IMDb
          <div
            className="rating-sort-btn"
            onClick={() =>
              isRatingAsc ? setIsRatingAsc(false) : setIsRatingAsc(true)
            }
            title="Sort by Rating"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "20px", width: "20px", background: "none" }}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="moviedesc">Description</div>
      </div>

      <div>
        {moviesListOrder.map((val, key) => {
          return (
            <div className="topbar2">
              <div className="moviename2">
                <p>{val.movie_name}</p>
              </div>
              <div className="movierating2">{val.movie_rating}</div>
              <div className="moviedesc2">
                <p>{val.movie_desc}</p>
                <div>
                  <EditIcon
                    className="edit-icon hoverOnCursor"
                    style={{ paddingLeft: "30px", height: "3.2vh" }}
                    onClick={() => {
                      settempname(val.movie_name);
                      settempdesc(val.movie_desc);
                      setnewname(val.movie_name);
                      setnewdesc(val.movie_desc);
                      settempid(val.id);
                      toggleModal();
                    }}
                  />
                  <DeleteIcon
                    className="trash-icon hoverOnCursor"
                    style={{ paddingLeft: "30px", height: "3.2vh" }}
                    onClick={() => {
                      setPopup(true);
                    }}
                  />
                </div>
              </div>

              <Modal
                isOpen={isPopup}
                onRequestClose={() => {
                  setPopup(false);
                }}
                style={{
                  overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                  },
                  content: {
                    width: "30vw",
                    height: "30vh",
                    margin: "auto",
                    padding: "1%",
                    borderRadius: "7px",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                  },
                }}
                centered
              >
                <h2 className="delete-message">
                  Do you want to delete the movie?
                </h2>
                <div className="delete-btns">
                  <button
                    onClick={() => {
                      deletemovie(val.id);
                      setPopup(false);
                    }}
                    className="popupBtn confirm-btn"
                    style={{ backgroundColor: "red" }}
                  >
                    confirm
                  </button>

                  <button
                    onClick={() => {
                      setPopup(false);
                    }}
                    className="popupBtn cancel-btn"
                  >
                    cancel
                  </button>
                </div>
              </Modal>
            </div>
          );
        })}
      </div>

      <div className="entrybox">
        <div className="Heading">Enter the Movie Details here</div>
        <br />
        <div className="formbox">
          <label for="mname">Movie Name</label>
          <br />
          <br />
          <input
            type="text"
            id="mname"
            maxLength="40"
            name="moviename"
            className="donkey"
            value={movie_name}
            placeholder="Mission Impossible : Rogue Nation "
            onChange={(event) => {
              setmoviename(event.target.value);
            }}
          />
          <br />
          <br />
          <label for="mrating">IMDb rating</label>
          <br />
          <br />
          <input
            type="text"
            id="mrating"
            maxLength="3"
            name="movierating"
            className="donkey"
            value={movie_rating}
            placeholder="8.4"
            onChange={(event) => {
              setmovierating(event.target.value);
            }}
          />
          <br />
          <br />
          <label for="mdesc">Movie Description</label>
          <br />
          <textarea
            style={{
              resize: "vertical",
            }}
            id="mdesc"
            name="moviedescription"
            rows="2"
            cols="40"
            maxLength="73"
            value={movie_desc}
            placeholder="Oscar Nominated, Action, Directed By: Michael Scott , Based on Iraq Wars"
            onChange={(event) => {
              setmoviedesc(event.target.value);
            }}
          ></textarea>
          <div className="center">
            <input
              type="submit"
              value="ADD"
              className="subm2"
              onClick={addmovie}
            />
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Movies;
