import styles from "@/styles/Movie.module.css"

const Spinner = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }
    else {
        return <div className={styles.spinner}>
            <img src="spinner.gif" />
        </div>
    }
}

export default Spinner