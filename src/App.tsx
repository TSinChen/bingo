import { useEffect, useState, useMemo, FormEvent } from 'react';
import cx from 'classnames';
import './styles/reset.scss';
import styles from './styles/style.module.scss';
import {
	MAX_SIZE,
	MIN_SIZE,
	SIZE,
	STORAGE_SELECTED_NUMBERS,
	STORAGE_SIZE,
} from './utils/constants';
import { BingoNumber } from './utils/type';
import {
	findDiagonalLines,
	findHorizontalLines,
	findVerticalLines,
	generateRandomNumbers,
	isInLeftDiagonal,
	isInRightDiagonal,
	oneDimensionToTwoDimension,
} from './utils/functions';

function App() {
	const [numbers, setNumbers] = useState<BingoNumber[]>([]);
	const [size, setSize] = useState(SIZE);
	const [sizeInput, setSizeInput] = useState(SIZE);

	const lines = useMemo(
		() => ({
			horizontal: findHorizontalLines(numbers, size),
			vertical: findVerticalLines(numbers, size),
			diagonal: findDiagonalLines(numbers, size),
		}),
		[numbers, size]
	);

	const select = (n: number) => {
		setNumbers((prev) =>
			prev.map((item) => (item.n === n ? { ...item, selected: true } : item))
		);
	};

	const decreaseSize = () => setSizeInput((prev) => prev - 1);

	const increaseSize = () => setSizeInput((prev) => prev + 1);

	const newGame = (e: FormEvent) => {
		e.preventDefault();
		setNumbers(
			generateRandomNumbers(sizeInput * sizeInput).map((n) => ({
				n,
				selected: false,
			}))
		);
		setSize(sizeInput);
		localStorage.setItem(STORAGE_SIZE, String(sizeInput));
		localStorage.removeItem(STORAGE_SELECTED_NUMBERS);
	};

	useEffect(() => {
		const storedNumbers = localStorage.getItem(STORAGE_SELECTED_NUMBERS);
		const storedSize = localStorage.getItem(STORAGE_SIZE);
		if (storedNumbers) {
			setNumbers(JSON.parse(storedNumbers) as BingoNumber[]);
		} else {
			setNumbers(
				generateRandomNumbers(size * size).map((n) => ({
					n,
					selected: false,
				}))
			);
		}
		if (storedSize) {
			setSize(Number(storedSize));
			setSizeInput(Number(storedSize));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_SELECTED_NUMBERS, JSON.stringify(numbers));
	}, [numbers]);

	return (
		<main className={styles.container}>
			<div className={styles.lines}>
				連線數：{Object.values(lines).flat().length}
			</div>
			<table className={styles.table}>
				<tbody>
					{oneDimensionToTwoDimension(numbers, size).map(
						(arr, horizontalIndex) => (
							<tr key={Math.random()}>
								{arr.map((n, verticalIndex) => {
									const isHorizontalChecked = lines.horizontal.includes(
										horizontalIndex * size
									);
									const isVerticalChecked =
										lines.vertical.includes(verticalIndex);
									const index = horizontalIndex * size + verticalIndex;
									const isLeftDiagonalChecked =
										n.selected &&
										lines.diagonal.includes(0) &&
										isInLeftDiagonal(index, size);
									const isRightDiagonalChecked =
										n.selected &&
										lines.diagonal.includes(size - 1) &&
										isInRightDiagonal(index, size);
									return (
										<td
											key={n.n}
											className={n.selected ? styles.selected : ''}
											onClick={n.selected ? undefined : () => select(n.n)}
										>
											{n.n}
											{isHorizontalChecked && (
												<div
													className={cx(styles.line, styles.horizontalChecked)}
												/>
											)}
											{isVerticalChecked && (
												<div
													className={cx(styles.line, styles.verticalChecked)}
												/>
											)}
											{isLeftDiagonalChecked && (
												<div
													className={cx(
														styles.line,
														styles.leftDiagonalChecked
													)}
												/>
											)}
											{isRightDiagonalChecked && (
												<div
													className={cx(
														styles.line,
														styles.rightDiagonalChecked
													)}
												/>
											)}
										</td>
									);
								})}
							</tr>
						)
					)}
				</tbody>
			</table>
			<form className={styles.form} onSubmit={newGame}>
				<div className={styles.form__size}>
					<button
						type="button"
						className={cx(
							styles.form__size__decrease,
							sizeInput <= MIN_SIZE && styles['form__size--disabled']
						)}
						onClick={sizeInput <= MIN_SIZE ? undefined : decreaseSize}
					>
						減少
					</button>
					<div
						className={styles.form__size__number}
					>{`${sizeInput} x ${sizeInput}`}</div>
					<button
						type="button"
						className={cx(
							styles.form__size__increase,
							sizeInput >= MAX_SIZE && styles['form__size--disabled']
						)}
						onClick={sizeInput >= MAX_SIZE ? undefined : increaseSize}
					>
						增加
					</button>
				</div>
				<button className={styles.form__button}>新遊戲</button>
			</form>
		</main>
	);
}

export default App;
