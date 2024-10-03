import "./Upload.css"

const Upload = () => {

    return (<div className="formbold-main-wrapper upload">
        <div className="w-full">
          <div className="formbold-form-wrapper">
            <div className="formbold-form-header">
              <h3>Submit Writing</h3>
            </div>
            <form
              action="https://formbold.com/s/FORM_ID"
              method="POST"
              className="formbold-chatbox-form"
            >
              <div className="formbold-mb-5">
                <label htmlFor="heading" className="formbold-form-label"> Heading </label>
                <input
                  type="text"
                  name="heading"
                  id="heading"
                  placeholder="Title here (be creative)"
                  className="formbold-form-input"
                />
              </div>
      
              <div className="formbold-mb-5">
                <label htmlFor="subject" className="formbold-form-label"> Subject </label>
                <textarea
                  rows = {2}
                  name="subject"
                  id="subject"
                  placeholder="Subject play/musical (ex: Tick Tick Boom on Broadway - Musical Review)"
                  className="formbold-form-input"
                />
              </div>
      
              <div className="formbold-mb-5">
                <label htmlFor="content" className="formbold-form-label"> Content </label>
                <textarea
                  rows= {10}
                  name="content"
                  id="content"
                  placeholder="Write your piece here..."
                  className="formbold-form-input"
                ></textarea>
              </div>

              <div className="formbold-checkbox-wrapper">
                    <label htmlFor="forPoints" className="formbold-checkbox-label">
                    <div className="formbold-relative">
                        <input
                        type="checkbox"
                        id="forPoints"
                        className="formbold-input-checkbox"
                        />
                        <div className="formbold-checkbox-inner">
                        <span className="formbold-opacity-0">
                            <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            className="formbold-stroke-current"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M8.81868 0.688604L4.16688 5.4878L2.05598 3.29507C1.70417 2.92271 1.1569 2.96409 0.805082 3.29507C0.453266 3.66742 0.492357 4.24663 0.805082 4.61898L3.30689 7.18407C3.54143 7.43231 3.85416 7.55642 4.16688 7.55642C4.47961 7.55642 4.79233 7.43231 5.02688 7.18407L10.0696 2.05389C10.4214 1.68154 10.4214 1.10233 10.0696 0.729976C9.71776 0.357624 9.17049 0.357625 8.81868 0.688604Z"
                                fill="white"
                            />
                            </svg>
                        </span>
                        </div>
                    </div>
                    Would you like to submit this for points?
                    </label>
                </div>
      
              <div>
                <button className="formbold-btn w-full">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )
}

export default Upload