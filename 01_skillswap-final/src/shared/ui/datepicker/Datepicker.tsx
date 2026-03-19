import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../icons';
import { Button } from '../button';
import styles from './Datepicker.module.scss';

export interface DatepickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
  className?: string;
}

const Datepicker: React.FC<DatepickerProps> = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder = 'Выберите дату',
  className = '',
  disabled = false,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const monthSelectRef = useRef<HTMLSelectElement>(null);
  const yearSelectRef = useRef<HTMLSelectElement>(null);
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const years = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - 100 + i);

  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(value || null);
  const [currentMonth, setCurrentMonth] = useState(
    value ? value.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    value ? value.getFullYear() : new Date().getFullYear()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        if (isOpen) {
          onBlur?.();
        }
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay(); // 0 = воскресенье
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonthTotalDays = getDaysInMonth(prevYear, prevMonth);

    for (let i = prevMonthTotalDays - prevMonthDays + 1; i <= prevMonthTotalDays; i++) {
      days.push({ day: i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
    }

    const totalDays = days.length;
    const nextDays = 42 - totalDays;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= nextDays; i++) {
      days.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }

    return days;
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    const newDate = new Date(year, month, day);
    setTempDate(newDate);
  };

  const handleSelect = () => {
    if (onChange) {
      onChange(tempDate);
    }
    setIsOpen(false);
    onBlur?.();
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleCancel = () => {
    setTempDate(value || null);
    setIsOpen(false);
    onBlur?.();
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(Number(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(Number(e.target.value));
  };

  const openPicker = () => {
    if (disabled) return;

    const baseDate = value ?? new Date();
    setTempDate(value ?? null);
    setCurrentMonth(baseDate.getMonth());
    setCurrentYear(baseDate.getFullYear());
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    openPicker();
  };

  const handleIconClick = () => {
    if (disabled) return;

    if (isOpen) {
      onBlur?.();
      inputRef.current?.blur();
      setIsOpen(false);
      return;
    }

    inputRef.current?.focus();
    openPicker();
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={`${styles.datepicker} ${className}`} ref={pickerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.inputWrapper} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''}`}
        onClick={handleInputFocus}
      >
        <input
          ref={inputRef}
          type='text'
          value={formatDateForInput(value)}
          readOnly
          placeholder={placeholder}
          className={styles.input}
          onFocus={handleInputFocus}
          disabled={disabled}
        />
        <Icon name='calendar' className={styles.calendarIcon} onClick={handleIconClick} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.header}>
            <div className={styles.selectWrapper} onClick={() => monthSelectRef.current?.focus()}>
              <select
                ref={monthSelectRef}
                value={currentMonth}
                onChange={handleMonthChange}
                className={styles.monthSelect}
              >
                {months.map((name, i) => (
                  <option key={i} value={i}>
                    {name}
                  </option>
                ))}
              </select>
              <span className={styles.selectedText}>{months[currentMonth]}</span>
              <Icon name='chevronDown' className={styles.chevron} />
            </div>
            <div className={styles.selectWrapper} onClick={() => yearSelectRef.current?.focus()}>
              <select
                ref={yearSelectRef}
                value={currentYear}
                onChange={handleYearChange}
                className={styles.yearSelect}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <span className={styles.selectedText}>{currentYear}</span>
              <Icon name='chevronDown' className={styles.chevron} />
            </div>
          </div>

          <div className={styles.weekdays}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => (
              <div key={idx} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.days}>
            {calendarDays.map((item, idx) => {
              const isSelected =
                tempDate &&
                item.day === tempDate.getDate() &&
                item.month === tempDate.getMonth() &&
                item.year === tempDate.getFullYear();
              const isToday =
                new Date().getDate() === item.day &&
                new Date().getMonth() === item.month &&
                new Date().getFullYear() === item.year;

              return (
                <button
                  key={idx}
                  type='button'
                  className={`
                    ${styles.day}
                    ${!item.isCurrentMonth ? styles.otherMonth : ''}
                    ${isSelected ? styles.selected : ''}
                    ${isToday ? styles.today : ''}
                  `}
                  onClick={() => handleDateClick(item.day, item.month, item.year)}
                  disabled={!item.isCurrentMonth}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <Button variant='secondary' size='full' onClick={handleCancel}>
              Отменить
            </Button>
            <Button variant='primary' size='full' onClick={handleSelect} disabled={!tempDate}>
              Выбрать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Datepicker };
export default Datepicker;
