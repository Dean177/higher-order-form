import { shallow } from 'enzyme'
import { noop } from 'lodash'
import * as React from 'react'
import { withForm, FormProps } from './withForm'
import { unwrapParentheses } from 'tslint'

type FormModel = { field: number, otherField: string }
type FormOwnProps = { someProp: number }
type MockFormProps = FormOwnProps & FormProps<FormModel>
const MockForm: React.ComponentType<MockFormProps> = (props) => (
  <form onSubmit={props.form.submit}>
    {props.form.controlFor.field(<input />)}
    {props.form.controlFor.otherField(<input />)}
  </form>
)
const mockSubmissionEvent = { preventDefault: noop }

describe('withForm', () => {
  const initialValues: FormModel = { field: 0, otherField: '' }
  const handleSubmission = jest.fn()
  const formCreator = withForm<FormOwnProps, FormModel>({
    initialValues: (props: FormOwnProps) => initialValues,
    validator: (props: FormOwnProps) => () => (state: FormModel) => ({ field: () => [] }),
    onSubmit: (props: FormOwnProps) => handleSubmission,
  })

  it('returns a function', () => {
    expect(typeof formCreator).toBe('function')
  })

  describe('withForm config', () => {
    const ownProps = { someProp: 5 }
    const initialValueSpy = jest.fn((props: FormOwnProps) => initialValues)
    const validatorSpy = jest.fn((state: FormModel) => ({ field: (fieldValue: number): Array<string> => [] }))
    const getValidatorSpy = jest.fn((props: FormOwnProps) => validatorSpy)
    const submitSpy = jest.fn((props: FormOwnProps) => noop)
    const ParamSpyForm: React.ComponentType<FormOwnProps> = withForm<FormOwnProps, FormModel>({
      initialValues: initialValueSpy,
      validator: getValidatorSpy,
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
        expect(getValidatorSpy).toHaveBeenCalledWith(ownProps)
        expect(validatorSpy).toHaveBeenCalledWith(initialValues)
      })
    })

    describe('getOnSubmission', () => {
      it('passes the components own props to allow the submit function to be dynamically set', () => {
        renderedForm.props().form.submit(mockSubmissionEvent)
        expect(submitSpy).toHaveBeenCalledWith(ownProps)
      })
    })
  })

  describe('form props', () => {
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
      expect(props.form.values).toBeDefined()
      expect(props.form.values).toBe(initialValues)
    })

    describe('controlFor', () => {
      it.skip('links the value and onChange of a control to the form state') // TODO
      it.skip('provides an onBlur prop to the control') // TODO
    })

    describe('submit', () => {
      const getInitialValues = (props: FormOwnProps) => initialValues

      it('will not submit if there are validation errors', () => {
        const getErrorValidator = (props: FormOwnProps) => (state: FormModel) =>
          ({ field: (fieldValue: number) => ['Errors'] })
        const submitSpy = jest.fn()
        const AlwaysErrorForm = withForm<FormOwnProps, FormModel>({
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
        const AlwaysErrorForm = withForm<FormOwnProps, FormModel>({
          initialValues: getInitialValues,
          validator: (props: FormOwnProps) => (state: FormModel) => ({
            field: (fieldValue: number) => validationErrors
          }),
          onSubmit: () => noop,
        })(MockForm)
        const renderedForm = shallow(<AlwaysErrorForm someProp={5} />)

        renderedForm.props().form.submit(mockSubmissionEvent)
        renderedForm.update()
        expect(renderedForm.props().form.validationErrors.field).toBe(validationErrors)
      })

      it('will call onSubmit if there are no validation errors', () => {
        const getNeverErrorValidator = (props: FormOwnProps) => (state: FormModel) =>
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
