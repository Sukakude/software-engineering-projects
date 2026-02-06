#include "FreeRTOS.h"
#include "task.h"
#include <stdio.h>
#include <time.h>
#include <stdbool.h>


// ------------- DATA STRUCTURES -------------
#define MAX_SLOTS 20
#define MAX_VEHICLE_ID_LEN 10

typedef enum { NORMAL, VIP } VehicleType;

typedef struct {
    char vehicleID[MAX_VEHICLE_ID_LEN];
    VehicleType type;
} Vehicle;

/* Parking slot structure */
typedef struct
{
    int slotID;
    bool isOccupied;
    char vehicleID[10];
    bool isVIP;
} ParkingSlot;

/* Global slot array */
#define MAX_SLOTS 10
ParkingSlot parkingSlots[MAX_SLOTS];


static int getAvailableSlots()
{
    int count = 0;
    for (int i = 0; i < MAX_SLOTS; i++)
    {
        if (!parkingSlots[i].isOccupied)
            count++;
    }
    return count;
}


FILE* logFile = NULL;

static void initLogFile()
{
    fopen_s(&logFile, "parking_log.txt", "a");
}

static void logActivity(const char* action, int slotID, const char* vehicleID)
{
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    if (t == NULL)
    {
        printf("[ERROR] localtime() failed!\n");
        return;
    }

    if (vehicleID == NULL) vehicleID = "UNKNOWN";
    if (action == NULL) action = "UNKNOWN";

    char buffer[100];
    sprintf_s(buffer, sizeof(buffer), "[%02d:%02d:%02d] Slot ID: P%02d, Vehicle ID: %s, %s\n",
        t->tm_hour, t->tm_min, t->tm_sec, slotID, vehicleID, action);

    printf("%s", buffer);

    if (logFile)
    {
        fprintf(logFile, "%s", buffer);
        fflush(logFile);
    }
}



// SLOT TRACKING TASK
static void vSlotMonitorTask(void* pvParameters) {
    for (;;) {
        fflush(stdout);
        vTaskDelay(pdMS_TO_TICKS(1000));
    }

    int available = 0;
    for (int i = 0; i < MAX_SLOTS; i++)
        if (!parkingSlots[i].isOccupied) available++;
    printf("[INFO] Available slots: %d / %d\n", available, MAX_SLOTS);

}
// SLOT RELEASE TASK
static void releaseSlot(int slotID)
{
    strcpy_s(parkingSlots[slotID].vehicleID, MAX_VEHICLE_ID_LEN, "");
    parkingSlots[slotID].isOccupied = false;
    logActivity("Slot Released", slotID, "N/A");

    int available = getAvailableSlots();
    printf("[INFO] Updated Available Slots: %d\n", available);
}

static void vVehicleExitTask(void* pvParameters)
{
    while (1)
    {
        // Simulate vehicle exit every 10 seconds
        for (int i = 0; i < MAX_SLOTS; i++)
        {
            if (parkingSlots[i].isOccupied)
            {
                printf("[ALERT] Vehicle Exit Detected. Slot ID: P%02d, Vehicle ID: %s\n",
                    i, parkingSlots[i].vehicleID);
                releaseSlot(i);
                break;
            }
        }
        vTaskDelay(pdMS_TO_TICKS(15000)); // every 15s
    }
}



// SLOT ALLOCATION TASK
static int assignSlot(Vehicle vehicle)
{
    for (int i = 0; i < MAX_SLOTS; i++)
    {
        if (!parkingSlots[i].isOccupied)
        {
            parkingSlots[i].isOccupied = true;
            strcpy_s(parkingSlots[i].vehicleID, MAX_VEHICLE_ID_LEN, vehicle.vehicleID);
            logActivity("Assigned", i, vehicle.vehicleID);

            int available = getAvailableSlots();
            printf("[INFO] Remaining Available Slots: %d\n", available);

            return i;
        }
    }

    printf("[ALERT] No available slots for vehicle %s!\n", vehicle.vehicleID);
    return -1; // No slot available
}

// VIP HANDLING TASK
static int assignVIPSlot(Vehicle vehicle)
{
    for (int i = 0; i < MAX_SLOTS; i++)
    {
        if (!parkingSlots[i].isOccupied)
        {
            parkingSlots[i].isOccupied = true;
            strcpy_s(parkingSlots[i].vehicleID, MAX_VEHICLE_ID_LEN, vehicle.vehicleID);
            logActivity("VIP Assigned", i, vehicle.vehicleID);

            int available = getAvailableSlots();
            printf("[INFO] Remaining Available Slots: %d\n", available);

            return i;
        }
    }

    printf("[ALERT] No available VIP slots for vehicle %s!\n", vehicle.vehicleID);
    return -1;
}


static void simulateVehicleEntry(const char* vehicleID, VehicleType type) {
    Vehicle v;
    strcpy_s(v.vehicleID, MAX_VEHICLE_ID_LEN, vehicleID);
    v.type = type;

    if (type == VIP) {
        printf("[WARNING] VIP Vehicle Detected! Vehicle ID: %s\n", vehicleID);
        assignVIPSlot(v);
    }
    else {
        assignSlot(v);
    }
}
static void vVehicleEntryTask(void* pvParameters) {
    while (1) {
        // Simulate vehicle arrival
        simulateVehicleEntry("V203", NORMAL);
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}

static void vVIPEntryTask(void* pvParameters) {
    while (1) {
        simulateVehicleEntry("VIP007", VIP);
        vTaskDelay(pdMS_TO_TICKS(15000));
    }
}

int main() {
    for (int i = 0; i < MAX_SLOTS; i++) {
        parkingSlots[i].slotID = i;
        parkingSlots[i].isOccupied = false;
    }

    xTaskCreate(vSlotMonitorTask, "SlotMonitor", 1000, NULL, 1, NULL);
    xTaskCreate(vVehicleEntryTask, "VehicleEntry", 1000, NULL, 2, NULL);
    xTaskCreate(vVIPEntryTask, "VIPEntry", 1000, NULL, 3, NULL);
    xTaskCreate(vVehicleExitTask, "ExitTask", 1000, NULL, 2, NULL);


    initLogFile();
    vTaskStartScheduler();
    // If scheduler fails
    printf("[ERROR] Scheduler failed to start\n");
    fflush(stdout);
    while (1); // Prevent exit

}

void vApplicationStackOverflowHook(TaskHandle_t xTask, char* pcTaskName) {
    printf("[ERROR] Stack overflow in task: %s\n", pcTaskName);
    fflush(stdout);
    while (1);
}