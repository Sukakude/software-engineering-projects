# Smart Parking Lot Management System (FreeRTOS)

---

# Project Overview

This project implements a Smart Parking Lot Management System using FreeRTOS and C in Visual Studio (WIN32 Simulator).

The system simulates a real-time parking environment where vehicles enter and exit, VIP vehicles are prioritized, parking slots are monitored continuously, and all activities are logged for auditing purposes.

FreeRTOS is used to manage concurrent tasks and ensure efficient real-time processing.

--- 

# Features
- Real-time parking slot monitoring
- Automatic slot assignment
- VIP vehicle prioritization
- Automatic slot release on exit
- Transaction logging with timestamps
- Console-based simulation
- Thread-safe access using mutexes
- Event-driven design using queues

---

# Technologies Used
- Language: C
- RTOS: FreeRTOS (WIN32-MSVC Port)
- IDE: Microsoft Visual Studio
- Platform: Windows (Simulation Mode)
- Concurrency: Tasks, Queues, Mutexes, Timers