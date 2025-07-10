-- CreateTable
CREATE TABLE "chat_session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "history" JSONB NOT NULL,

    CONSTRAINT "chat_session_pkey" PRIMARY KEY ("id")
);
