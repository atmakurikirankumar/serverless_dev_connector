import React, { Fragment } from "react";
import Moment from "react-moment";
import moment from "moment";
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";
import { Link } from "react-router-dom";

const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu.id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{moment.utc(edu.from)}</Moment> -{" "}
        {edu.to === null || edu.to === "" ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{moment.utc(edu.to)}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      {education.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th className="hide-sm">Degree</th>
              <th className="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{educations}</tbody>
        </table>
      ) : (
        <p className="my-1">
          No Education details are added. Please add one{" "}
          <Link to="/add-education">HERE</Link>
        </p>
      )}
    </Fragment>
  );
};

export default connect(null, { deleteEducation })(Education);
