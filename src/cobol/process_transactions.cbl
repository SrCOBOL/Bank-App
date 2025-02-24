       IDENTIFICATION DIVISION.
       PROGRAM-ID. ProcessTransactions.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT INPUT-FILE ASSIGN TO 'src/cobol/input.txt'
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT OUTPUT-FILE ASSIGN TO 'src/cobol/output.txt'
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  INPUT-FILE.
       01  INPUT-RECORD.
           05  INPUT-TRANSACTION-ID     PIC X(10).
           05  INPUT-EMAIL              PIC X(30).
           05  INPUT-NAME               PIC X(30).
           05  INPUT-AMOUNT             PIC S9(7)V99.
           05  INPUT-TRANSACTION-DATE   PIC X(10).

       FD  OUTPUT-FILE.
       01  OUTPUT-RECORD.
           05  OUTPUT-TRANSACTION-ID     PIC X(10).
           05  OUTPUT-TRANSACTION-STATUS PIC X(20).

       WORKING-STORAGE SECTION.
       01  WS-END-OF-FILE         PIC X VALUE 'N'.
       01  WS-FS-INPUT            PIC X(02) VALUE '00'.
       01  WS-FS-OUTPUT           PIC X(02) VALUE '00'.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           OPEN INPUT INPUT-FILE
           IF WS-FS-INPUT NOT = '00'
               DISPLAY 'ERROR OPENING INPUT FILE' WS-FS-INPUT
               STOP RUN.

           OPEN OUTPUT OUTPUT-FILE
           IF WS-FS-OUTPUT NOT = '00'
               DISPLAY 'ERROR OPENING OUTPUT FILE' WS-FS-OUTPUT
               STOP RUN.

           PERFORM UNTIL WS-END-OF-FILE = 'Y'
               READ INPUT-FILE
                   AT END
                       MOVE 'Y' TO WS-END-OF-FILE
                   NOT AT END
                       PERFORM PROCESS-RECORD
               END-READ
           END-PERFORM.

           CLOSE INPUT-FILE
           IF WS-FS-INPUT NOT = '00'
               DISPLAY 'ERROR CLOSING INPUT FILE' WS-FS-INPUT.

           CLOSE OUTPUT-FILE
           IF WS-FS-OUTPUT NOT = '00'
               DISPLAY 'ERROR CLOSING OUTPUT FILE' WS-FS-OUTPUT.

           STOP RUN.

       PROCESS-RECORD.
           MOVE INPUT-TRANSACTION-ID TO OUTPUT-TRANSACTION-ID
           IF INPUT-AMOUNT > 0
               MOVE 'SUCCESS' TO OUTPUT-TRANSACTION-STATUS
           ELSE
               MOVE 'FAILURE' TO OUTPUT-TRANSACTION-STATUS
           END-IF.
           WRITE OUTPUT-RECORD FROM OUTPUT-RECORD.
           DISPLAY 'RECORD WRITTEN: ' OUTPUT-TRANSACTION-ID
                       ' ' OUTPUT-TRANSACTION-STATUS.
           EXIT.
