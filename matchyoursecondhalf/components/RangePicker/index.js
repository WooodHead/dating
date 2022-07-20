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
    color: 'rgba(84, 84, 75, 0.5)',
    fontSize: '16px'
  };

  const handleStyles = {
    background: '#355C7D',
    borderColor: '#355C7D',
    boxShadow: 'none'
  };

  const trackStyles = {
    backgroundColor: '#355C7D'
  };

  const railStyles = {
    backgroundColor: '#D8C4C9'
  };

  const activeDotStyle = {
    borderColor: '#355C7D',
    backgroundColor: '#355C7D'
  };

  const dotStyle = {
    borderColor: '#D8C4C9',
    width: '9px',
    height: '9px'
  };

  const marks = {
    [startPoint]: {
      value: startPoint,
      style: marksStyles,
      label: <div className="text-nowrap text-semibold color-blue-900">{startPoint} km</div>,
    },
    [endPoint]: {
      value: endPoint,
      style: marksStyles,
      label: <div className="text-nowrap text-semibold color-blue-900">{endPoint} km</div>,
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
