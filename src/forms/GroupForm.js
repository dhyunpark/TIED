import React, {Component} from 'react';
import style from '../style';
import '../components/styles.css';

class GroupForm extends Component {
  constructor(props) {
    super(props)
    this.state = { name: this.props.data.name, description: this.props.data.description, img: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
  }
  handleNameChange(e) {
      this.setState({ name: e.target.value });
  }
  handleDescriptionChange(e) {
      this.setState({ description: e.target.value });
  }
  handleImgChange(e) {
      this.setState({ img: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let name = this.state.name.trim();
    let description = this.state.description.trim();
    if (!name || !description) {
      return;
    }
    this.props.onGroupSubmit({ name:name, description:description});
    this.setState({ name:'', description:'', img:'' });
  }
  render() {
    return (
//page formatting
			<div className="divFont divCenter">
				<div id="right">
					<h2><form className="formStyle" onSubmit={ this.handleSubmit }>
						Enter POD Name:<br/>
						<input type="text" placeholder="TIDE Enthusiasts" value={ this.state.name} onChange={ this.handleNameChange } required="required"/><br/>

            Description:<br/>
						<textarea id="groupDesc" name="Description" placeholder="Do not eat." rows="15" cols="50" value={ this.state.description} onChange={ this.handleDescriptionChange } required="required"></textarea><br/>
            {/*Enter Group Image:<br/>
						<input type="file" name="bannerGroup" accept="image/*" /><br/> */}
						<input type="submit" value='Submit' className="pageButton"/>
					</form></h2>
				</div>
			</div>
    )
  }
}

export default GroupForm;
