import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Our products</h2>
      <div className={styles.grid}>
        <div className={styles.item}>
          <Link href="/GasCalculator">
            <a style={{ fontSize: 40, color: "cyan", border: "2px solid black", padding: 10 }}>Gas Guzzler</a>
          </Link>
        </div>
      </div>
    </div >
  )
}
