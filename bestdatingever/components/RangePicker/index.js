import Slider, { SliderTooltip, Handle } from 'rc-slider';
import { Controller } from "react-hook-form";

function RangePickerField(
  {
    label,
    value,
    onChange,
    error = false,
    helperText,
    startPoint,
    endPoint,
    ...rest
  }
) {
  const marksStyles = {
    color: '#4B5064',
    fontSize: '16px'
  };

  const handleStyles = {
    background: '#347B91',
    borderColor: '#347B91',
    boxShadow: 'none'
  };

  const trackStyles = {
    backgroundColor: '#347B91'
  };

  const railStyles = {
    backgroundColor: '#ADB1C2'
  };

  const activeDotStyle = {
    borderColor: '#347B91'
  };

  const dotStyle = {
    borderColor: '#ADB1C2'
  };

  const marks = {
    [startPoint]: {
      value: startPoint,
      style: marksStyles,
      label: <div className="text-nowrap">{startPoint}</div>,
    },
    [endPoint]: {
      value: endPoint,
      style: marksStyles,
      label: <div className="text-nowrap">{endPoint}</div>,
    },
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
    <div className="pt-2 px-1">
      <Slider
        allowCross={false}
        min={startPoint}
        max={endPoint}
        step={1}
        value={value}
        defaultValue={value}
        marks={marks}
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
