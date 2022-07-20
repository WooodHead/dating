import Slider, { SliderTooltip, Handle, Range } from 'rc-slider';
import { Controller } from "react-hook-form";
import cn from "classnames";
import styles from "./index.module.scss";

function RangePickerField(
  {
    label,
    value,
    onChange,
    error = false,
    helperText,
    startPoint,
    endPoint,
    range = false,
    ...rest
  }
) {
  const marksStyles = {
    color: 'rgba(84, 84, 75, 0.5)',
    fontSize: '16px',
    top: 0
  };

  const handleStyles = {
    background: '#031539',
    borderColor: '#031539',
    width: '20px',
    height: '20px',
    marginTop: '-9px',
    boxShadow: 'none'
  };

  const trackStyles = {
    backgroundColor: '#9F9DB2'
  };

  const railStyles = {
    backgroundColor: '#9F9DB2'
  };

  const activeDotStyle = {
    borderColor: '#D0AB5E'
  };

  const dotStyle = {
    display: 'none'
  };

  const marksDistance = {
    [startPoint]: {
      value: startPoint,
      style: marksStyles,
      label: <div className="text-nowrap text-italic color-blue-900">{value || 0} <span className="color-grey-600">km</span></div>,
    },
  };

  const marks = {
    [startPoint]: {
      value: startPoint,
      style: marksStyles,
      label: <div className="text-nowrap text-italic color-blue-900">{value[0]} <span className="color-grey-600">y.o</span></div>,
    },
    [endPoint]: {
      value: endPoint,
      style: marksStyles,
      label: <div className="text-nowrap text-italic color-blue-900">{value[1]} <span className="color-grey-600">y.o</span></div>,
    }
  };

  const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <SliderTooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${value} km`}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </SliderTooltip>
    );
  };

  return (
    <div className={cn(styles.wrap, 'pt-2')}>
      {!range ?
        (<Slider
          allowCross={false}
          min={startPoint}
          max={endPoint}
          step={1}
          value={value}
          defaultValue={value}
          marks={marksDistance}
          dotStyle={dotStyle}
          activeDotStyle={activeDotStyle}
          tipFormatter={value => `${value} km`}
          handle={handle}
          trackStyle={[trackStyles]}
          handleStyle={[handleStyles, handleStyles]}
          railStyle={railStyles}
          onChange={onChange}
          {...rest}
        />
      ) : (
        <Range
          allowCross={false}
          min={startPoint}
          max={endPoint}
          step={1}
          value={value}
          defaultValue={value}
          marks={marks}
          dotStyle={dotStyle}
          activeDotStyle={activeDotStyle}
          trackStyle={[trackStyles]}
          handleStyle={[handleStyles, handleStyles]}
          railStyle={railStyles}
          onChange={onChange}
          {...rest}
        />
      )}
    </div>
  );
};

function RangePicker(
  {
    label,
    name,
    control,
    options,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <RangePickerField
          label={label}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          options={options}
          {...rest}
        />
      )}
    />
  );
}

export default RangePicker;
