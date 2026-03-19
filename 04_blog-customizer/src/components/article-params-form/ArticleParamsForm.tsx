import { useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	ArticleStateType,
	defaultArticleState,
} from 'src/constants/articleProps';

import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';
import { RadioGroup } from 'src/ui/radio-group';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

type ArticleParamsFormProps = {
	onApply: (newStyles: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {

	const [isOpen, setIsOpen] = useState(false);

	const [selectedFont, setSelectedFont] = useState(fontFamilyOptions[0]);

	const [selectedSize, setSelectedSize] = useState(fontSizeOptions[0]);

	const [selectedFontColor, setSelectedFontColor] = useState(fontColors[0]);

	const [selectedBgColor, setSelectedBgColor] = useState(backgroundColors[0]);

	const [selectedWidth, setSelectedWidth] = useState(contentWidthArr[0]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newStyles = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedSize,
			fontColor: selectedFontColor,
			backgroundColor: selectedBgColor,
			contentWidth: selectedWidth,
		};

		onApply(newStyles);
	};

	const handleReset = () => {
		setSelectedFont(defaultArticleState.fontFamilyOption);
		setSelectedSize(defaultArticleState.fontSizeOption);
		setSelectedFontColor(defaultArticleState.fontColor);
		setSelectedBgColor(defaultArticleState.backgroundColor);
		setSelectedWidth(defaultArticleState.contentWidth);

		onApply(defaultArticleState);
	};

	const sideBarRef = useRef<HTMLDivElement>(null);
	useOutsideClickClose({
		isOpen,
		rootRef: sideBarRef,
		onChange: setIsOpen,
	});

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

			<aside
				ref={sideBarRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as='h2' size={31} weight={800} uppercase align='left'>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={selectedFont}
						onChange={setSelectedFont}
					/>

					<RadioGroup
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={selectedSize}
						onChange={setSelectedSize}
						name='fontSize'
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={selectedFontColor}
						onChange={setSelectedFontColor}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={selectedBgColor}
						onChange={setSelectedBgColor}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={selectedWidth}
						onChange={setSelectedWidth}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
