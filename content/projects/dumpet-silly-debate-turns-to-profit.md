---
title: "Dumpet Decentralized Voting Platform"
slug: "dumpet-decentralized-voting-platform"
date: "2025-10-21"
description: "A decentralized voting platform that gamifies everyday debates with real stakes, built on Arweave and AO Protocol."
image: "/assets/image/dumpet.png"
tags: ["Decentralized App", "Blockchain", "Smart Contracts", "React", "Arweave"]
author: "Criztiandev"
---

# Dumpet Decentralized Voting Platform

Building Dumpet was equally challenging and rewarding, especially given the decentralization stack's nuances. The reliance on Arweave’s ecosystem, while innovative for permanent data storage, introduced unpredictable delays and occasional network instability causing the app to "hang" or fail to load live voting data intermittently. This was a real hurdle given the demo’s importance to showing the platform’s value.

## Inspiration

Noticed how people love arguing about trivial things online but rarely put their money where their mouth is. Wanted to gamify silly debates while adding real stakes.

## Techstack

- React
- Vite
- Jotai
- ScadcnUI
- Arweave
- Supabase
- Tailwindcss
- Typescript

## What It Does

Dumpet.fun enables users to compete in popularity duels by:

- Starting fun duels between two sides (Teams/Fandoms/Preferences)
- Voting for their preferred side
- Earning platform currency based on being on the winning side
- Creating debates ranging from "Milk vs Orange Juice" to "Taylor Swift Super Bowl Attendance"
- Tracking real-time voting stats and results
- Engaging in debate discussions while votes are active

The platform turns everyday arguments into competitive duels where users stake currency on their stance, with winners determined by popular vote.

## Key Features

### Real-Time Voting & Voting

Implementing low-latency voting using AO Protocol with React Query was challenging but critical for a seamless experience. Users see live vote counts and stake currency securely with Web3 wallet authentication—all transparent and tamper-resistant thanks to blockchain.

### Decentralized Permanent Storage

Using ArDrive on Arweave provided a unique edge by permanently storing market data and results, ensuring no data loss and verifiable outcomes that reinforce trust.

### Intuitive UI/UX

Despite the complex voting mechanics and blockchain tech, building the interface with React, Vite, TailwindCSS, and ShadcnUI kept the platform accessible and engaging on desktop and mobile.

### Secure Wallet Integration & Liquidity Management

Managed secure wallet connections, prevented manipulation of deposits/withdrawals, and rigorously tested smart contracts to protect user funds and ensure fairness.

## Challenges & How We Addressed Them

- Real-time post, updates and data fetching in AO infrastructure
- Deployment process using ArDrive’s decentralized storage
- Preventing manipulation of deposit/withdrawal systems and vote manipulation
- Managing liquidity across multiple duels for seamless experience
- Creating intuitive user flows and making complex voting accessible
- Handling race conditions, managing distributed state, and optimizing performance during high traffic
- Platform security including dispute resolution and smart contract vulnerability management

## Lessons Learned

Building Dumpet sharpened my skills in decentralized app development, from smart contract security to UI/UX design for complex mechanics. The AO protocol and Arweave's permanent storage showed me the power and challenges of decentralized infrastructure. Managing real-time data in a trustless environment and keeping user experience smooth demanded a thoughtful blend of innovation and engineering discipline.

## Results & Impact

- Delivered a fully functional decentralized voting platform with robust blockchain backend
- Achieved real-time voting updates with minimal latency and strong anti-manipulation safeguards
- Created engaging social voting features fostering user interaction and competition
- Maintained platform stability and optimized performance under load
- Pushed forward the possibilities of decentralized social voting on emerging protocols

## Demo & Alternative Access

The live demo is temporarily offline due to issues in the Arweave ecosystem, which underpins Dumpet’s decentralized storage. Meanwhile, you can:

- If you want still want to visit the site here is the [link](https://dumpet-fun.vercel.app/)
- Watch a detailed [demo video](https://www.youtube.com/watch?v=dQw4w9WgXcQ) showcasing core features
- Explore the full [source code on GitHub](https://github.com/YourUsername/Dumpet) for technical insights

We’re actively working with Arweave to restore demo access and improve platform resilience.
