import { shallow } from 'enzyme'
import { noop } from 'lodash'
import * as React from 'react'
import { withForm, Form } from './withForm'

type FormModel = { field: number, otherField: string }
type FormOwnProps = { someProp: number }
type MockFormProps = FormOwnProps & Form<FormModel>
const MockForm = (props: MockFormProps) =>
  <form onSubmit={props.form.submit}>
    {props.form.controlFor('field')(<input />)}
    {props.form.controlFor('otherField')(<input />)}
  </form>

const mockSubmissionEvent = { preventDefault: noop }

describe('withForm', () => {
  const initialValues: FormModel = { field: 0, otherField: '' }
  const handleSubmission = jest.fn()
  const formCreator = withForm<FormModel, FormOwnProps>({
    initialValues: (props: FormOwnProps) => initialValues,
    validator: (state: FormModel, props: FormOwnProps) => ({field: () => []}),
    onSubmit: (props: FormOwnProps) => handleSubmission,
  })

  it('returns a function', () => {
    expect(typeof formCreator).toBe('function')
  })

  // TODO
  // it('should render without error', () => {
  //   const WrappedMockForm = formCreator(MockForm)
  //   expect(<WrappedMockForm someProp={4} />).toRenderWithoutError()
  // })

  describe('withForm parameters', () => {
    const ownProps = { someProp: 5 }
    const initialValueSpy = jest.fn((props: FormOwnProps) => initialValues)
    const validatorSpy = jest.fn(((state: FormModel, props: FormOwnProps) =>
      ({ field: (fieldValue: number): Array<string> => [] })
    ))
    const submitSpy = jest.fn((props: FormOwnProps) => noop)
    const ParamSpyForm = withForm({
      initialValues: initialValueSpy,
      validator: validatorSpy,
      onSubmit: submitSpy,
    })(MockForm)
    const renderedForm = shallow(<ParamSpyForm someProp={ownProps.someProp} />)

    describe('initialValues', () => {
      it('passes the components own props to allow the initial form values to be dynamically set', () => {
        expect(initialValueSpy).toHaveBeenCalledWith(ownProps)
      })
    })

    describe('validator', () => {
      it('passes the components props and form state to allow the validation rules to be dynamically set', () => {
        renderedForm.props().form.submit(mockSubmissionEvent)
        expect(validatorSpy).toHaveBeenCalledWith(initialValues, ownProps)
      })
    })

    describe('getOnSubmission', () => {
      it('passes the components own props to allow the submit function to be dynamically set', () => {
        renderedForm.props().form.submit(mockSubmissionEvent)
        expect(submitSpy).toHaveBeenCalledWith(ownProps)
      })
    })
  })

  describe('form prop', () => {
    it('passes though all props and provides a form prop to the wrapped component', () => {
      const WrappedMockForm = formCreator(MockForm)
      const wrappedForm = shallow(<WrappedMockForm someProp={5} />)
      const props = wrappedForm.props()
      expect(props.someProp).toBe(5)
      expect(props.form).toBeDefined()
    })

    it('passes the current state of the form as a prop', () => {
      const WrappedMockForm = formCreator(MockForm)
      const wrappedForm = shallow(<WrappedMockForm someProp={5} />)
      const props = wrappedForm.props()
      expect(props.form.fieldValues).toBeDefined()
      expect(props.form.fieldValues).toBe(initialValues)
    })

    describe('controlFor', () => {
      it.skip('links the value and onChange of a control to the form state')
      it.skip('provides hasError & onBlur props to the control')
    })

    describe('submit', () => {
      const getInitialValues = (props: FormOwnProps) => initialValues

      it('will not submit if there are validation errors', () => {
        const getErrorValidator = (state: FormModel, props: FormOwnProps) =>
          ({ field: (fieldValue: number) => ['Errors'] })
        const submitSpy = jest.fn()
        const AlwaysErrorForm = withForm<FormModel, FormOwnProps>({
          initialValues: getInitialValues,
          validator: getErrorValidator,
          onSubmit: () => submitSpy,
        })(MockForm)
        const renderedForm = shallow(<AlwaysErrorForm someProp={5}/>)

        renderedForm.props().form.submit(mockSubmissionEvent)

        expect(submitSpy).not.toHaveBeenCalled()
      })

      it('displays validation errors if they are present and the form is submitted', () => {
        const validationErrors = ['Errors']
        const getErrorValidator = (state: FormModel, props: FormOwnProps) =>
          ({ field: (fieldValue: number) => validationErrors })
        const AlwaysErrorForm = withForm<FormModel, FormOwnProps>({
          initialValues: getInitialValues,
          validator: getErrorValidator,
          onSubmit: () => noop,
        })(MockForm)
        const renderedForm = shallow(<AlwaysErrorForm someProp={5} />)

        renderedForm.props().form.submit(mockSubmissionEvent)
        expect(renderedForm.props().form.validationErrors().field).toBe(validationErrors)
      })

      it('saves if there are no validation errors', () => {
        const getNeverErrorValidator = (state: FormModel, props: FormOwnProps) =>
          ({ field: (fieldValue: number) => [] })
        const submitSpy = jest.fn()
        const AlwaysErrorForm = withForm({
          initialValues: getInitialValues,
          validator: getNeverErrorValidator,
          onSubmit: () => submitSpy,
        })(MockForm)
        const renderedForm = shallow(<AlwaysErrorForm someProp={5} />)

        renderedForm.props().form.submit(mockSubmissionEvent)

        expect(submitSpy).toHaveBeenCalledWith(initialValues)
      })
    })

    describe('validationErrors', () => {
      it('will not return any validation errors for a bit of state which has not been interacted with')
      it('will return validation errors if an attempt to submit the form has been made')
      it('gets the current validation errors for a piece of form state')
    })
  })
})
