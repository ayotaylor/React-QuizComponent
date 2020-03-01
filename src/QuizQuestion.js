import React, {Component} from "react"

import QuizQuestionButton from "./QuizQuestionButton"

class QuizQuestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            incorrectAnswer : false
        }
        this.handleClick = this.handleClick.bind(this);
      }

    handleClick(buttonText) {
        // console.log("handleClick(buttonText)!!!")
        if (buttonText === this.props.quiz_question.answer) {
            //console.log("handleClick(buttonText)!!!")
            //console.log("QUiz question: ", this.props.quiz_question)
            this.setState({incorrectAnswer : false})
            this.props.showNextQuestionHandler()
        }
        else { 
            this.setState({incorrectAnswer : true})
        }
    }

    render() {
        // console.log("Quiz position:", this.props.position)
        // console.log("Props in QuizQuestion: ", this.props)
        return (
            <main>
                {
                    this.state.incorrectAnswer ? 
                        <p className="error">Sorry, that's not right</p> : null
                    
                }
                <section>
                <p>{this.props.quiz_question.instruction_text}</p>
                </section>
                <section className="buttons">
                <ul>
                    {
                        this.props.quiz_question.answer_options.map((item, index) =>
                            <QuizQuestionButton 
                                key={index} 
                                button_text={item}
                                clickHandler={this.handleClick} />
                        )
                    }
                </ul>
                </section>
            </main>
        )
    }
}

export default QuizQuestion