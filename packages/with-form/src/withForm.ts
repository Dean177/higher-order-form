import { assign, mapValues, pickBy, some } from 'lodash'
import {
  createElement,
  cloneElement,
  Component,
  ComponentClass,
  ComponentType,
  EventHandler,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  PureComponent,
  ReactElement,
  ReactNode,
} from 'react'
import {
  hasValidationErrors,
  validate,
  ValidationResult,
  Validator,
  ValueValidationResult,
} from 'composable-validation'

type TODO = any // TODO remove

type Decorator<OP, EP> = (someComponent: ComponentType<EP>) => ComponentType<OP>
type ElementDecorator<Props, EnhancedProps> = (element: ReactElement<EnhancedProps>) => ReactElement<Props>

export function getValueFromEvent<I, O>(e: I): O
export function getValueFromEvent(e: any): any { // tslint:disable-line:no-any
  // support elements which just return their value
  if (!e || !e.target) {
    return e
  }

  return e.target.type === 'checkbox' ?
    e.target.checked :
    e.target.value
}

export type FormControlProps<ValueType> = {
  ariaLabel?: string,
  disabled?: boolean,
  id?: string,
  onBlur?: (event?: any) => void, // tslint:disable-line:no-any
  onChange?: (value: ValueType) => void,
  value?: ValueType,
}
export type FormControl<T> = Component<FormControlProps<T>>


export type Form<FormModel> = {
  form: {
    controlFor: (formField: FieldName<FormModel>) =>
      (element: ReactElement<FormControlProps<FormModel[FieldName<FormModel>]>>) =>
        ReactElement<FormControlProps<FormModel[FieldName<FormModel>]>>,
    fieldValues: FormModel,
    hasValidationErrors: boolean,
    ifValid: (callback: (formModel: FormModel) => void) => void,
    saveFormControlLabelRef: (formField: FieldName<FormModel>) => (node: ReactNode) => void,
    submit:
      EventHandler<FormEvent<HTMLFormElement>> &
      MouseEventHandler<{}>,
    validationErrors: () => ValidationResult<FormModel>,
  },
}

export type FieldName<FormModel> = keyof FormModel
type ByFormKey<FormModel, T> = { [K in keyof FormModel]: T }

type FieldMeta = { hasBlurred: boolean, errors: ValueValidationResult }
type FieldsMeta<FM> = ByFormKey<FM, FieldMeta>

const noValidationErrors: ValueValidationResult = []

type FormWrapperState<FM> = { fieldMeta: FieldsMeta<FM>, values: FM }

type Config<FM, OP> = {
  initialValues: (ownProps: OP) => FM,
  validator: (formState: FM, ownProps: OP) => Validator<FM>,
  onSubmit: (ownProps: OP) => (formModel: FM) => void,
}

export const withForm =
  <FM extends object, OP>(config: Config<FM, OP>): Decorator<OP, OP & Form<FM>> =>
    (WrappedComponent: ComponentType<OP & Form<FM>>): ComponentClass<OP> =>
      class FormWrappedComponent extends PureComponent<OP, FormWrapperState<FM>> {
        cachedEventHandlers: Partial<ByFormKey<FM, { onBlur: TODO, onChange: (value: TODO) => void }>> = {}
        cachedRefMappers: Partial<ByFormKey<FM, (component: ReactElement<FormControl<FM[keyof FM]>>) => void>> = {}
        formControlsLabelRefs: Partial<ByFormKey<FM, HTMLElement>> = {}

        constructor(props: OP) {
          super(props)
          const values: FM = config.initialValues(props)
          const initialValidator: Validator<FM> = config.validator(values, props)
          const initialValidationResult: TODO = validate(initialValidator as TODO, values);
          const fieldMeta = mapValues(values, (value: FM[FieldName<FM>], fieldName: FieldName<FM>): FieldMeta => ({
            errors: initialValidationResult[fieldName],
            hasBlurred: false,
          })) as TODO as FieldsMeta<FM>

          this.state = {
            fieldMeta,
            values,
          }
        }

        validationErrors = (): ValidationResult<FM> =>
          pickBy(
            mapValues(
              this.state.fieldMeta,
              (meta: FieldMeta): ValueValidationResult =>
                ((meta != null && meta.hasBlurred) ? (meta.errors) : noValidationErrors),
            ) as TODO as ValidationResult<FM>,
            (errors) => errors && errors.length > 0
          )

        ifValid = (callbackIfValid: (formModel: FM) => void): void => {
          const validationResult = validate(config.validator(this.state.values, this.props) as TODO, this.state.values)
          if (!hasValidationErrors(validationResult)) {
            callbackIfValid(this.state.values)
          } else {
            // Mark all fields as blurred so that validation errors are shown
            this.setState((currentState) => ({
              fieldMeta: mapValues<FieldsMeta<FM>>(currentState.fieldMeta, ({ errors }: FieldMeta): FieldMeta =>
                ({ errors, hasBlurred: true })),
              values: currentState.values,
            }))
          }
        }

        onSubmit = (event: FormEvent<HTMLFormElement> & MouseEvent<{}>): void => {
          event.preventDefault()
          this.ifValid(config.onSubmit(this.props))
        }

        saveFormControlLabelRef =
          (fieldName: FieldName<FM>): ((node: ReactElement<FormControl<FM[FieldName<FM>]>>) => void) => {
            if (this.cachedRefMappers[fieldName] == null) {
              this.cachedRefMappers[fieldName] =
                (component: ReactElement<FormControl<FM[FieldName<FM>]>>): void => {
                  this.formControlsLabelRefs =
                    assign({}, this.formControlsLabelRefs, { [fieldName as string]: component })
                }
            }
            return this.cachedRefMappers[fieldName] as (node: ReactElement<FormControl<FM[FieldName<FM>]>>) => void
          }

        controlFor = (
          fieldName: FieldName<FM>,
        ): ElementDecorator<FormControlProps<FM[FieldName<FM>]>, FormControlProps<FM[FieldName<FM>]>> => {
          type ControlProps = FormControlProps<FM[FieldName<FM>]>

          if (this.cachedEventHandlers[fieldName] == null) {
            this.cachedEventHandlers[fieldName] = {
              // Typescript complains when using object spread on a generic type, use lodash's assign to work around.
              onBlur: () => this.setState(currentState => ({
                fieldMeta: assign({}, currentState.fieldMeta, {
                  [fieldName]: ({ ...currentState.fieldMeta[fieldName], hasBlurred: true }),
                }),
                values: currentState.values,
              })),
              onChange: (event: TODO) => {
                const newValue = getValueFromEvent(event)
                this.setState(currentState => { // tslint:disable-line:no-any
                  const nextValues = assign({}, currentState.values, { [fieldName]: newValue })
                  const validatorInstance: Validator<FM> = config.validator(nextValues, this.props)
                  const validationResult: TODO = validate(validatorInstance as TODO, nextValues)
                  const nextFieldMeta = mapValues(
                    currentState.fieldMeta,
                    (currentFieldMeta, keyFieldName: keyof FM) => ({
                      ...currentFieldMeta,
                      errors: validationResult[keyFieldName],
                    }),
                  )

                  return {
                    fieldMeta: nextFieldMeta,
                    values: nextValues,
                  }
                })
              },
            }
          }

          const value: FM[FieldName<FM>] = this.state.values[fieldName]
          const props: FormControlProps<FM[FieldName<FM>]> = {
            ...this.cachedEventHandlers[fieldName],
            // TODO
          // hasError: this.state.fieldMeta[fieldName].hasBlurred && this.state.fieldMeta[fieldName].errors.length > 0,
            value,
          }

          return (control: ReactElement<ControlProps>): ReactElement<ControlProps> => {
            const { onChange: existingOnChange, ...existingProps } = control.props
            const newOnChange = existingOnChange == null
              ? props.onChange
              : (fieldValue: FM[FieldName<FM>]) => {
                existingOnChange(fieldValue)
                if (props.onChange != null) {
                  props.onChange(fieldValue)
                }
              }

            const enhancedProps: ControlProps = { ...existingProps, ...props, onChange: newOnChange }

            return cloneElement<ControlProps, ControlProps>(control, enhancedProps)
          }
        }

        render() {
          const hasUserVisibleValidationErrors  =
            some(this.state.fieldMeta as object, ((fm: FieldMeta) => fm.hasBlurred && fm.errors.length > 0))

          const formProps: Form<FM> = { form: {
            controlFor: this.controlFor,
            fieldValues: this.state.values,
            hasValidationErrors: hasUserVisibleValidationErrors,
            ifValid: this.ifValid,
            saveFormControlLabelRef: this.saveFormControlLabelRef,
            submit: this.onSubmit,
            validationErrors: this.validationErrors,
          }}

          const enhancedProps: OP & Form<FM> = assign({}, this.props, formProps)

          return createElement<OP & Form<FM>>(WrappedComponent as ComponentClass<OP & Form<FM>>, enhancedProps)
        }
      }
