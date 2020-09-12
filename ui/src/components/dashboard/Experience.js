import React, { Fragment } from "react";
import Moment from "react-moment";
import moment from "moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import { Link } from "react-router-dom";

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((exp) => (
    <tr key={exp.id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{moment.utc(exp.from)}</Moment> -{" "}
        {exp.to === null || exp.to === "" ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{moment.utc(exp.to)}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      {experience.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th className="hide-sm">Title</th>
              <th className="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{experiences}</tbody>
        </table>
      ) : (
        <p className="my-1">
          No work experiences are added. Please add one{" "}
          <Link to="/add-experience">HERE</Link>
        </p>
      )}
    </Fragment>
  );
};

export default connect(null, { deleteExperience })(Experience);
