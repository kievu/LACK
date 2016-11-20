//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import type { Indicator } from '../../actions'

class CategoryStep extends Component{
	props: {
		countries: any,
		countryCode: string,
		countryName: string,
    indicators: Array<Indicator>,
		indicatorMap: Object,
    stepIndex: number,
    surveyYears: Array<number>,
    variables: Array<Object>,
    categorySelected: (category: any, stepIndex: number) => void,
		showNextStep: (stepIndex: number) => void,
		showPreviousStep: (stepIndex: number) => void,
	}
	state: {
		indicator: Object,
		categories: Object,
	}
	constructor() {
		super();
		this.state = {
			indicator: {},
			categories: {},
		}
	}
	generateCategories(data: any, categories: Object, indicatorMap: Object) {

		data.map(data => {
			if (categories[indicatorMap[data.IndicatorId].Level1] === undefined) {
				categories[indicatorMap[data.IndicatorId].Level1] = []
			}
			const inside = {}
			inside["Label"] = data.Indicator
      inside["Definition"] = indicatorMap[data.IndicatorId].Definition
			inside["IndicatorId"] = data.IndicatorId
			inside["DataId"] = data.DataId
			inside["SurveyId"] = data.SurveyId
			inside["Value"] = data.Value
			categories[indicatorMap[data.IndicatorId].Level1].push(inside)
			return inside
		})
	}

	render() {
		if (!this.props.variables || this.props.indicators.length === 0) {
      return (
				<div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<CircularProgress size={60} thickness={5} />
					</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<p>Large amount of data are being fetched</p>
					</div>
				</div>
			)
    }
		if (this.props.variables.length === 0) {
			return (
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<p>There exist no data for {this.props.countryName}</p>
				</div>
			)
		} else {
		 this.generateCategories(this.props.variables, this.state.categories, this.props.indicatorMap)
		 return (
		 	<div>
		 		<List>
		 			{Object.keys(this.state.categories).sort().map(category =>
             (<FlatButton style={{ display: 'flex', justifyContent: 'center', width: '100%'}}
                          key={category}
                          hoverColor={'#B5D66B'}
                          label={category}
                          labelStyle={{textTransform: 'capitalize'}}
                          onClick={() => this.props.categorySelected(this.state.categories[category], this.props.stepIndex)}/>))}
		 		</List>
		 	</div>
		 );
	  }
  }
}

const ConnectedPage = connect(
  (state) => ({
		countries: state.fetching.countries,
		countryCode: state.survey.countryCode,
		countryName: state.survey.countryName,
    indicators: state.fetching.indicators,
		indicatorMap: state.survey.indicatorMap,
		surveyYears: state.survey.years,
    stepIndex: state.routing.stepIndex,
		variables: state.fetching.variables,
  }),
  (dispatch) => ({
    categorySelected: (subCategory: any, stepIndex: number) => {
      dispatch({ type: 'CATEGORY_SELECTED', subCategory: subCategory })
      dispatch({ type: 'PAGE_REQUESTED', name: 'SelectData', stepIndex: stepIndex })
    },
    showNextStep: (stepIndex: number) => dispatch({ type: 'PAGE_REQUESTED', name: 'SelectSurveys', stepIndex: stepIndex }),
		showPreviousStep: (stepIndex: number) => dispatch({ type: 'PREVIOUS_PAGE_REQUESTED', stepIndex: stepIndex })
  }),
)(CategoryStep);

export default ConnectedPage;